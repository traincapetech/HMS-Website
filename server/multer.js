//multer.js
import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB to ensure larger files work

// Use memory storage for Render deployment
const storage = multer.memoryStorage();

// File filter with enhanced error handling
const fileFilter = (req, file, cb) => {
    const allowedfiletypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedfiletypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, PDF are allowed`));
    }
};

// File upload configuration with error handling
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
}).fields([
    { name: 'document', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]);

// Middleware wrapper to handle multer errors
const uploadFiles = (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.error('Multer error:', err.message);
            return res.status(400).json({ 
                message: `File upload error: ${err.message}`,
                field: err.field
            });
        } else if (err) {
            // An unknown error occurred
            console.error('Unknown upload error:', err.message);
            return res.status(500).json({ message: err.message });
        }
        
        // Everything went fine
        next();
    });
};

export { uploadFiles };
