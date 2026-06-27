import { Request, Response } from "express";
import db from "../config/database";

export const getAllMahasiswa = async (req: Request, res: Response) => {
  try {
    // Membaca kueri parameter dari URL frontend [cite: 115, 124, 125, 126, 127]
    const search = String(req.query.search || "");
    const prodiId = req.query.prodi_id ? Number(req.query.prodi_id) : null;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params: any[] = [];

    // Kondisi pencarian NIM atau Nama [cite: 131, 132]
    if (search) {
      where += " AND (m.nim LIKE ? OR m.nama LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Kondisi filter program studi [cite: 135, 136]
    if (prodiId) {
      where += " AND m.prodi_id = ?";
      params.push(prodiId);
    }

    // Menghitung total data keseluruhan untuk pagination [cite: 139, 140]
    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total FROM mahasiswa m ${where}`,
      params
    );
    const total = countRows[0].total;

    // Mengambil data mahasiswa yang di-JOIN dengan tabel prodi [cite: 144, 154]
    const [rows] = await db.query(
      `SELECT
        m.id,
        m.nim,
        m.nama,
        m.angkatan,
        m.foto,
        p.id AS prodi_id,
        p.nama_prodi
      FROM mahasiswa m
      JOIN prodi p ON m.prodi_id = p.id
      ${where}
      ORDER BY m.id DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      message: "Data mahasiswa berhasil diambil",
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const createMahasiswa = async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi_id, angkatan } = req.body;
    const foto = req.file ? req.file.filename : null; // Ambil nama file jika diupload [cite: 179]

    if (!nim || !nama || !prodi_id || !angkatan) {
      return res.status(400).json({
        message: "NIM, nama, prodi, dan angkatan wajib diisi",
      });
    }

    // Cek duplikasi NIM [cite: 185, 186]
    const [existing]: any = await db.query(
      "SELECT id FROM mahasiswa WHERE nim = ?",
      [nim]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "NIM sudah digunakan" });
    }

    // Simpan ke database [cite: 192, 193]
    const [result]: any = await db.query(
      `INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto)
       VALUES (?, ?, ?, ?, ?)`,
      [nim, nama, Number(prodi_id), Number(angkatan), foto]
    );

    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan",
      data: { id: result.insertId, nim, nama, prodi_id, angkatan, foto },
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nim, nama, prodi_id, angkatan } = req.body;

    const fields = ["nim = ?", "nama = ?", "prodi_id = ?", "angkatan = ?"];
    const values: any[] = [nim, nama, Number(prodi_id), Number(angkatan)];

    // Jika user mengunggah foto baru saat melakukan edit [cite: 211, 212]
    if (req.file) {
      fields.push("foto = ?");
      values.push(req.file.filename);
    }

    values.push(id);

    const [result]: any = await db.query(
      `UPDATE mahasiswa SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    res.json({ message: "Mahasiswa berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result]: any = await db.query("DELETE FROM mahasiswa WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
