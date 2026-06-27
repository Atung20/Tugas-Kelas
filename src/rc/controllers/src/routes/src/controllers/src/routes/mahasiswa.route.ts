import { Router } from "express";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getAllMahasiswa);
// Menyisipkan middleware Multer singe file bernama "foto" [cite: 239, 240]
router.post("/", uploadFotoMahasiswa.single("foto"), createMahasiswa);
router.put("/:id", uploadFotoMahasiswa.single("foto"), updateMahasiswa);
router.delete("/:id", deleteMahasiswa);

export default router;
