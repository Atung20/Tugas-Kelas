import { Router } from "express";
import { getAllProdi } from "../controllers/prodi.controller";

const router = Router();

router.get("/", getAllProdi); // Endpoint GET /api/prodi [cite: 112, 343]

export default router;
