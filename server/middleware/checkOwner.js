// middleware/checkOwner.js
import User from '../Models/userSchema.js';

export const checkOwnerRole = async (req, res, next) => {
    try {
        // Find user by ID (from verifyToken middleware)
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Check if user role is 'owner'
        if (user.role !== 'owner') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Only hotel owners can perform this action.' 
            });
        }
        
        // User is owner, proceed
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};