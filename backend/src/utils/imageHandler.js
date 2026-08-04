import cloudinary from '../config/cloudinary.config.js';
import streamifier from "streamifier";

export const uploadImage = async (file) => {
    try {
        // validate if file is present in request
        if (!file) {
            throw new Error("No file uploaded");
        }

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "ecommerce_charanjitGurbhi",
                        resource_type: "image",
                        unique_filename: true,
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };

        const result = await uploadToCloudinary();
        return result.secure_url;
    } catch (error) {
        throw error;
    }
}

export const deleteImage = async (imageUrl) => {
    try {
        const extractPublicId = (url) => {
            if(!url) return null;
            // Matches everything after /upload/ and an optional /v12345/ up to the file extension
            const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
            const match = url.match(regex);
            return match ? match[1] : null;
        };
        const publicId = extractPublicId(imageUrl);

        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: false //reduces credit usage, but the image may still be cached in some places 
        });

        return result; // Returns { result: 'ok' } if successful
    } catch (error) {
        // console.error("Deletion failed:", error);
        throw error;
    }
};