const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../'),
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}.${file.mimetype.split('/').pop()}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5000000,
    },
});

module.exports = upload.single('image');

// FILE TYPES FILTER
// fileFilter: (req, file, cb) => {
//   const fileTypes = /jpeg|jpg|png|gif/;
//   const mimetype = fileTypes.test(file.mimetype);
//   const extname = fileTypes.test(path.extname(file.originalname));
//   if (mimetype && extname) return cb(null, true);
//   cb('Error: Archivo debe ser una imagen valida');
// },
