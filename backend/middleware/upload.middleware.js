// upload.middleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { storage } from '../config/cloudinary.config.js';

const upload = multer({ storage });

export default upload;
