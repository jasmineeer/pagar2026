const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pagar_api/sppg_reports',
    allowed_formats: [
        'jpg', 
        'jpeg', 
        'png', 
        'webp'
    ],
    transformation: [{ 
        width: 800, 
        height: 600, 
        crop: 'limit' 
    }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }
});

module.exports = upload;
