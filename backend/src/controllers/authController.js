import User from "../models/User.js";
import { generateHash, verifyHash } from "../utils/bcrypt.js";
import { generateToken, decryptToken } from "../utils/jwt.js";


export const registerUser = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Name, phone and password are required' });
        }

        const user = await User.findOne({ phone }).lean();
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await generateHash(password);
        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            role: 'client'
        });
        await newUser.save();

        //generate JWT token for the user and save as cookie
        const token = generateToken({ id: newUser._id, role: newUser.role });
        res.cookie('token', token,
            {
                httpOnly: true,
                sameSite: 'none', // Allows cross-origin cookie sharing
                secure: true,     // Required for sameSite: 'none'
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const loginUser = async (req, res) => {
    try {

        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password are required' });
        }
        const user = await User.findOne({ phone }).lean();
        if (!user) {
            return res.status(400).json({ message: 'Invalid phone or password' });
        }
        //verify password
        const isPasswordValid = await verifyHash(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid phone or password' });
        }

        //generate JWT token for the user and save as cookie
        const token = generateToken({ id: user._id, role: user.role });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none', // Allows cross-origin cookie sharing
            secure: true,     // Required for sameSite: 'none'
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const isUserLoggedIn = async (req, res) => {
    try {
        const token = req.cookies.token;
        //authenticate user using JWT token from cookies
        if (!token) {
            console.log("no token")
            return res.status(200).json({ user: {} });
        }
        const decoded = decryptToken(token);

        //fetch user from database using decoded token
        const user = await User.findById(decoded.id).lean().select("-password");
        if (!user) {
            console.log("no user")
            return res.status(200).json({ user: {} });
        }

        //attach user to request object
        res.status(200).json(user);
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ user: {} });
    }
}

