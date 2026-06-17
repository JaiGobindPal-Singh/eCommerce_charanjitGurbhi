import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    
    fileFilter: (req, file, cb) => {        //cb represents callback function
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

export default upload;