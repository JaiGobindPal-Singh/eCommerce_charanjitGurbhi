import {v2 as cloudinary} from "cloudinary";
import { env } from '../config/env.js';

cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApi,
    api_secret: env.cloudinarySecret,
    secure: true
});

export default cloudinary;