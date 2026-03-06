import pool from "../config/db.js";

// GET ALL
export const getWorkProcess = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM work_process ORDER BY order_number ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
export const createWorkProcess = async (req, res) => {
  try {
    const { title, description, order_number } = req.body;

    await pool.query(
      "INSERT INTO work_process (title, description, order_number) VALUES (?, ?, ?)",
      [title, description, order_number]
    );

    res.json({ message: "Work process created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateWorkProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order_number, is_active } = req.body;

    await pool.query(
      `UPDATE work_process 
       SET title = ?, description = ?, order_number = ?, is_active = ?
       WHERE id = ?`,
      [title, description, order_number, is_active, id]
    );

    res.json({ message: "Work process updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteWorkProcess = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM work_process WHERE id = ?", [id]);

    res.json({ message: "Work process deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};