import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| GET ALL SERVICES
|--------------------------------------------------------------------------
| Ambil semua services + urutkan berdasarkan order_index
*/
export const getServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM services ORDER BY order_index ASC"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed get services" });
  }
};

/*
|--------------------------------------------------------------------------
| GET SERVICE BY ID
*/
export const getServiceById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM services WHERE id=?",
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed get service" });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE SERVICE
*/
export const createService = async (req, res) => {
  try {
    const { title, description, icon, order_index, features } = req.body;

    await pool.query(
      "INSERT INTO services(title,description,icon,order_index, features) VALUES (?,?,?,?,?)",
      [title, description, icon, order_index, features]
    );

    res.json({ message: "Service created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed create service" });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SERVICE
*/
export const updateService = async (req, res) => {
  try {
    const { title, description, icon, order_index, features } = req.body;

    await pool.query(
      `UPDATE services 
       SET title=?, description=?, icon=?, order_index=? , features=?
       WHERE id=?`,
      [title, description, icon, order_index,features, req.params.id]
    );

    res.json({ message: "Service updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed update service" });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE SERVICE
*/
export const deleteService = async (req, res) => {
  try {
    await pool.query("DELETE FROM services WHERE id=?", [
      req.params.id,
    ]);

    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed delete service" });
  }
};