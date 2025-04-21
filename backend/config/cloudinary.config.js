import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CLOUD_NAME, API_KEY, API_SECRET } from '../config/env.js';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "boarding_images",
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
    public_id: file.originalname.split('.')[0] + '-' + Date.now() // to avoid overwrites
  }),
});


export { cloudinary, storage };
