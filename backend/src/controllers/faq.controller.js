import pool from "../config/db.js";

// GET all FAQ
export const getFaq = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM faq ORDER BY order_index ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching FAQ" });
  }
};

// CREATE FAQ
export const createFaq = async (req, res) => {
  try {
    const { question, answer, order_index } = req.body;

    await pool.query(
      "INSERT INTO faq (question, answer, order_index) VALUES (?, ?, ?)",
      [question, answer, order_index || 0]
    );

    res.status(201).json({ message: "FAQ created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating FAQ" });
  }
};

// UPDATE FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, order_index } = req.body;

    await pool.query(
      "UPDATE faq SET question=?, answer=?, order_index=? WHERE id=?",
      [question, answer, order_index || 0, id]
    );

    res.json({ message: "FAQ updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating FAQ" });
  }
};

// DELETE FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM faq WHERE id=?", [id]);

    res.json({ message: "FAQ deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting FAQ" });
  }
};