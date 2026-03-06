import pool from "../config/db.js";

export const getAllPortfolio = async () => {
  const [rows] = await pool.query("SELECT * FROM portfolio ORDER BY id DESC");
  return rows;
};

export const createPortfolio = async (data) => {
  const { title, description, image_url, category, features } = data;

  const [result] = await pool.query(
    "INSERT INTO portfolio (title, description, image_url, category, features) VALUES (?,?,?,?,?)",
    [title, description, image_url, category, features]
  );

  return result.insertId;
};

export const updatePortfolio = async (id, data) => {
  const { title, category, features, image_url } = data;

  await pool.query(
    "UPDATE portfolio SET title=?, category=?, features=?, image_url=? WHERE id=?",
    [title, category, features, image_url, id]
  );
};

export const deletePortfolio = async (id) => {
  await pool.query("DELETE FROM portfolio WHERE id=?", [id]);
};
