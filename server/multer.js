//multer.js
import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024 //5MB


const storage = multer.memoryStorage();

//File filter 
const fileFilter = (req, file, cb) => {
    const allowedfiletypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedfiletypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type only JPEG, PNG, PDF are allowed'));
    }
};

//file upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});

const uploadFiles = upload.fields([
    {name: 'document', maxCount: 1},
    {name: 'image', maxCount: 1}
]);

export {uploadFiles};