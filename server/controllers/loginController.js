import userModel from "../model/userSchema.js";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

dotenv.config();

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        // 2. Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(400).json({ success: false, message: "Invalid password" });

        // 3. Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 4. Send token + user info
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            name,
            email,
            password: hashPassword,
            role: role || 'guest'
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await userModel.find()
        res.json(user)

    } catch (error) {
        res.json({ error: error.message })

    }
}

export const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const userExist = await userModel.findById(id)
        if (!userExist) {
            return res.json("User not found")
        }
        const updateUser = await userModel.findByIdAndUpdate(id, req.body)
        res.status(200).json({
            message: "User updated successfully"
        })

    } catch (error) {
        res.json({ error: error.message })

    }

}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const userExist = await userModel.findById(id)
        if (!userExist) {
            return res.json("User not found")
        }
        const deleteUser = await userModel.findByIdAndDelete(id)
        res.json({ message: 'User deleted sucessfully' })

    } catch (error) {
        res.json({ error: error.message })

    }

}

// Update user profile (authenticated endpoint)
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { name, phoneNumber } = req.body;

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                image: user.image
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                image: user.image
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};