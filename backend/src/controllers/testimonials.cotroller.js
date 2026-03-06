import pool from "../config/db.js";

// GET semua testimonial aktif
export const getTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
};

// CREATE testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, message, rating, photo } = req.body;

    await pool.query(
      `INSERT INTO testimonials (name, message, rating, photo, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [name, message, rating, photo || null]
    );

    res.status(201).json({ message: "Testimonial created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating testimonial" });
  }
};

// UPDATE testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, rating, is_active } = req.body;

    await pool.query(
      `UPDATE testimonials 
       SET name=?, message=?, rating=?, is_active=? 
       WHERE id=?`,
      [name, message, rating, is_active ? 1 : 0, id]
    );

    res.json({ message: "Testimonial updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM testimonials WHERE id = ?", [id]);

    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};