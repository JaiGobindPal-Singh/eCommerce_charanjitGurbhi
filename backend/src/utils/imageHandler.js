import cloudinary from '../config/cloudinary.config.js';
import streamifier from "streamifier";

export const uploadImage = async (file) => {
    try {
        //validate if file is present in request
        if (!file) {
            throw new Error("No file uploaded");
        }

        //sub function to upload image to cloudinary using streamifier to convert buffer to stream
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "ecommerce_charanjitGurbhi",
                        transformation: [
                            { width: 2000, height: 2000, crop: "pad", background: "white" },
                            { quality: "auto:good" },
                            { fetch_format: "auto" }
                        ]
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
        return result.secure_url; //return the secure url of the uploaded image

    } catch (error) {
        // console.log("error uploading image", error.message);
        throw error
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