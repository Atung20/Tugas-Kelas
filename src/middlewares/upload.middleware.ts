import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/mahasiswa"); // Folder penyimpanan foto mahasiswa [cite: 69]
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `mhs-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`; // Menghindari duplikasi nama file [cite: 73]
    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]; // Format yang diizinkan [cite: 78]

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("File harus berupa JPG, PNG, atau WEBP")); // Validasi ekstensi [cite: 80]
  }

  cb(null, true);
};

export const uploadFotoMahasiswa = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Maksimal 2 MB [cite: 88]
  },
});
