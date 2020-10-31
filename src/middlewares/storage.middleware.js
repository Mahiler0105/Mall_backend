const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../"),
  filename: (req, file, cb) => {
    return cb(
      null,
      uuidv4() + path.extname(file.originalname).toLocaleLowerCase(),
    );
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimetype && extname) return cb(null, true);
    cb("Error: Archivo debe ser una imagen valida");
  },
});

module.exports = upload.single("image");
