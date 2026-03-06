import pool from "../config/db.js";

export const getProblems = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM problems");
  res.json(rows);
};

export const createProblem = async (req, res) => {
  const { title, description } = req.body;

  await pool.query(
    "INSERT INTO problems (title, description) VALUES (?, ?)",
    [title, description]
  );

  res.json({ message: "Created" });
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { title, description, is_active } = req.body;

  await pool.query(
    "UPDATE problems SET title=?, description=?, is_active=? WHERE id=?",
    [title, description, is_active, id]
  );

  res.json({ message: "Updated" });
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM problems WHERE id=?", [id]);

  res.json({ message: "Deleted" });
};