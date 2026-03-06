// controllers/pricing.controller.js
import pool from "../config/db.js";

export const getPricing = async (req, res) => {
  try {
    const [pricingRows] = await pool.query("SELECT * FROM pricing");
    const [featureRows] = await pool.query("SELECT * FROM pricing_features");

    const result = pricingRows.map((pkg) => {
      const features = featureRows
        .filter((f) => f.pricing_id === pkg.id)
        .map((f) => ({
          id: f.id,
          feature: f.feature_text, // ⚠ sesuaikan nama kolom
          pricing_id: f.pricing_id
        }));

      return {
        ...pkg,
        features,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching pricing" });
  }
};
export const createPricing = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { name, description, price, is_popular, features } = req.body;

    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO pricing (name, description, price, is_popular)
       VALUES (?, ?, ?, ?)`,
      [name, description, price, is_popular ? 1 : 0]
    );

    const pricingId = result.insertId;

    if (features && features.length > 0) {
      for (const feature of features) {
        await connection.query(
          `INSERT INTO pricing_features (pricing_id, feature_text)
           VALUES (?, ?)`,
          [pricingId, feature]
        );
      }
    }

    await connection.commit();

    res.status(201).json({ message: "Pricing created successfully" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, is_popular } = req.body;

    await pool.query(
      "UPDATE pricing SET name=?, price=?, description=?, is_popular=? WHERE id=?",
      [name, Number(price), description, is_popular ? 1 : 0, id]
    );

    res.json({ message: "Update harga successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePricing = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM pricing_features WHERE pricing_id = ?`,
      [id]
    );

    await connection.query(
      `DELETE FROM pricing WHERE id = ?`,
      [id]
    );

    await connection.commit();

    res.json({ message: "Pricing deleted" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};


/////

export const addFeature = async (req, res) => {
  try {

    const { pricing_id, feature } = req.body;

    if (!feature) {
      return res.status(400).json({
        message: "Feature tidak boleh kosong"
      });
    }

    await pool.query(
      "INSERT INTO pricing_features (pricing_id, feature_text) VALUES (?,?)",
      [pricing_id, feature]
    );

    res.json({
      message: "Feature berhasil ditambahkan"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { feature } = req.body;

    await pool.query(
      "UPDATE pricing_features SET feature_text = ? WHERE id = ?",
      [feature, id]
    );

    res.json({ message: "Feature updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};


export const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM pricing_features WHERE id = ?",
      [id]
    );

    res.json({ message: "Feature deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};