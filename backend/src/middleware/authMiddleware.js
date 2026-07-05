import User from '../models/User.js';
import { decryptToken } from '../utils/jwt.js';

export const authenticateUser = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        //authenticate user using JWT token from cookies
        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }
        const decoded = decryptToken(token);

        //fetch user from database using decoded token
        const user = await User.findById(decoded.id).lean();
        if(!user){
            return res.status(401).json({message: 'Unauthorized'});
        }

         //attach user to request object
        req.user = {
            id: String(user._id),
            name:user.name,
            phone:user.phone,
            role:user.role
        }
        next();
    }catch(error){
        // console.error('Authentication error:', error);
        return res.status(401).json({message: 'Unauthorized'});
    }
}

export const authorizeAdmin = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }
        const decoded = decryptToken(token);
        if(decoded.role !== 'admin'){
            return res.status(403).json({message: 'Forbidden'});
        }
        next();
    }catch(error){
        // console.error('Admin Authorization error:', error);
        return res.status(403).json({message: 'Forbidden'});
    }
}

