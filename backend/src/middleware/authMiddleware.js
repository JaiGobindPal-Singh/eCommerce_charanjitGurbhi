import User from '../models/user.model.js';
import { decryptToken, generateToken } from '../utils/jwt.js';

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        //authenticate user using JWT token from cookies
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = decryptToken(token);

        //fetch user from database using decoded token
        const user = await User.findById(decoded.id)
        .select('name phone role address')
        .lean();

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        //attach user to request object
        req.user = {
            id: String(user._id),
            name: user.name,
            phone: user.phone,
            role: user.role,
            address: user.address
        }
        //refreshing token
        const tokenRef = generateToken({ id: user._id, role: user.role });
        res.cookie('token', tokenRef, {
            httpOnly: true,
            sameSite: 'none', // Allows cross-origin cookie sharing
            secure: true,     // Required for sameSite: 'none'
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export const authorizeAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = decryptToken(token);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        // fetch user from database using decoded token
        const user = await User.findById(decoded.id)
        .select('name phone role address')
        .lean();
        
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        //attach user to request object
        req.user = {
            id: String(user._id),
            name: user.name,
            phone: user.phone,
            role: user.role,
            address: user.address
        }

        //refreshing token
        const tokenRef = generateToken({ id: user._id, role: user.role });
        res.cookie('token', tokenRef, {
            httpOnly: true,
            sameSite: 'none', // Allows cross-origin cookie sharing
            secure: true,     // Required for sameSite: 'none'
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        next();
    } catch (error) {
        console.error('Admin Authorization error:', error);
        return res.status(403).json({ message: 'Forbidden' });
    }
}

