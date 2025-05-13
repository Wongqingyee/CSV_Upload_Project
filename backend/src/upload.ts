import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { Pool } from "pg";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "your-password",
  port: 5432,
});

router.post("/upload", upload.single("csv"), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const rows: any[] = [];

  fs.createReadStream(file.path)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      try {
        const headers = Object.keys(rows[0]);
        for (const row of rows) {
          await pool.query(`INSERT INTO uploads(data) VALUES ($1)`, [row]);
        }
        res.json({ message: "CSV uploaded and data saved.", headers: headers });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
      } finally {
        fs.unlinkSync(file.path);
      }
    });
});

router.get("/data", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = (req.query.search as string)?.toLowerCase() || "";

  try {
    let whereClause = "";
    let values: any[] = [limit, offset];

    if (search) {
      whereClause = "WHERE LOWER(data::text) LIKE $3";
      values.push(`%${search}%`);
    }

    // Fetch data with optional search
    const result = await pool.query(
      `
      SELECT * FROM uploads
      ${whereClause}
      ORDER BY id 
      LIMIT $1 OFFSET $2
      `,
      values
    );

    // Get total count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM uploads ${
        search ? "WHERE LOWER(data::text) LIKE $1" : ""
      }`,
      search ? [`%${search}%`] : []
    );

    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    // Preserve column order from first row
    const headers =
      result.rows.length > 0 ? Object.keys(result.rows[0].data) : [];

    res.json({
      rows: result.rows,
      headers,
      total,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB read error" });
  }
});

export default router;
