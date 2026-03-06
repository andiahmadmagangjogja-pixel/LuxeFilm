import pool from "../config/db.js";

export const getWhyChoose = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM why_choose_us");
  res.json(rows);
};

export const createWhyChoose = async (req, res) => {
  const { title, description } = req.body;

  await pool.query(
    "INSERT INTO why_choose_us (title, description) VALUES (?, ?)",
    [title, description]
  );

  res.json({ message: "Created" });
};

export const updateWhyChoose = async (req, res) => {
  const { id } = req.params;
  const { title, description, is_active } = req.body;

  await pool.query(
    "UPDATE why_choose_us SET title=?, description=?, is_active=? WHERE id=?",
    [title, description, is_active, id]
  );

  res.json({ message: "Updated" });
};

export const deleteWhyChoose = async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM why_choose_us WHERE id=?", [id]);

  res.json({ message: "Deleted" });
};