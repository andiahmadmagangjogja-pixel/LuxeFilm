import pool from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, package_id, event_date, message } = req.body;

    await pool.query(
      `INSERT INTO bookings 
      (name, email, phone, package_id, event_date, message) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, package_id, event_date, message]
    );

    res.status(201).json({ message: "Booking berhasil dikirim" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT bookings.*, pricing.name AS package_name
      FROM bookings
      LEFT JOIN pricing ON bookings.package_id = pricing.id
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      "UPDATE bookings SET status=? WHERE id=?",
      [status, id]
    );

    res.json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM bookings WHERE id=?", [id]);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};