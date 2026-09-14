const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "week9_uploads",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "jfif", "heic"],
        transformation: [
            { width: 500, height: 500, crop: "limit" }
        ]
    }
});

// Only size limit — Cloudinary handles file type validation
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

module.exports = upload;