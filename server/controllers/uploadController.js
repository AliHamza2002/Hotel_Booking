import cloudinary from '../configs/cloudinaryConfig.js';
import fs from 'fs';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "hotel-booking",
            resource_type: "auto"
        });

        // Remove file from local storage
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: "Image uploaded successfully",
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        // Remove file if upload fails
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};
