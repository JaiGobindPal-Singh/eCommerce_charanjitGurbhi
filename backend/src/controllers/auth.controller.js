import User from '../models/user.model.js'
import { generateHash, verifyHash } from "../utils/bcrypt.js";
import { generateToken, decryptToken } from "../utils/jwt.js";


export const registerUser = async (req, res) => {
    try {
        const { name, phone, streetAddress = "", city = "", state = "", postalCode = "" } = req.body;
        const password = String(req.body.password);
        if (!name || !phone || !password) {
            return res.status(400).json({ error: 'Name, phone and password are required' });
        }
        if (password.trim().length < 8) {
            return res.status(400).json({ error: "short password" })
        }
        //fetching user from db to check if user exist
        const user = await User.findOne({ phone }).lean();
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }
        //hashing password and saving to db
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
            user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                role: newUser.role,
                streetAddress: user.streetAddress,
                city: user.city,
                state: user.state,
                postalCode: user.postalCode,
            }
        });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const loginUser = async (req, res) => {
    try {

        const { phone } = req.body;
        const password = String(req.body.password);
        
        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password are required' });
        }
        const user = await User.findOne({ phone }).lean();
        if (!user) {
            return res.status(400).json({ error: 'invalid phone or password' });
        }
        //verify password
        const isPasswordValid = await verifyHash(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'invalid phone or password' });
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
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                streetAddress: user.address.streetAddress,
                city: user.address.city,
                state: user.address.state,
                postalCode: user.address.postalCode,
            }
        });

    } catch (error) {
        return res.status(500).json({ error: 'internal server error' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
export const isUserLoggedIn = async (req, res) => {
    try {
        const token = req.cookies.token;
        //authenticate user using JWT token from cookies
        if (!token) {
            return res.status(200).json({ user: {} });
        }
        const decoded = decryptToken(token);

        //fetch user from database using decoded token
        const user = await User.findById(decoded.id).lean().select("-password");
        if (!user) {
            return res.status(200).json({ user: {} });
        }

        //attach user to request object
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                phone: user.phone,
                streetAddress: user.address.streetAddress,
                city: user.address.city,
                state: user.address.state,
                postalCode: user.address.postalCode,
            }
        });
    } catch (error) {
        return res.status(401).json({ user: {} });
    }
}
export const setUserAddress = async (req, res) => {
    try {

        const { streetAddress, city, state, postalCode = "" } = req.body;
        if (!streetAddress || !city || !state) {
            return res.status(400).json({ error: "address details are required" });
        }
        if (!req.user?.id) {
            return res.status(400).json({
                error: "Login required"
            })
        }
        const addressObj = { streetAddress, city, state, postalCode }
        const user = await User.findByIdAndUpdate(req.user?.id, {
            $set: { address: addressObj }
        });
        return res.status(200).json({
            success: true
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "internal server error" })
    }
}
