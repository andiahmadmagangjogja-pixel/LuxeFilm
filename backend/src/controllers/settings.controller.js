import pool from "../config/db.js";

// GET settings
export const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM settings LIMIT 1");
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE settings
export const updateSettings = async (req, res) => {
  try {
    const {
      hero_title,
      hero_subtitle,
      hero_button_text,
      hero_button_link,
      about_title,
      about_text,
      about_image,
      contact_email,
      contact_phone,
      whatsapp_number,
      office_address,
      google_maps_embed,
      instagram_link,
      facebook_link,
      linkedin_link,
      tiktok_link,
      meta_title,
      meta_description,
      promo_title,
      promo_description,
      promo_discount,
      promo_end_date,
      promo_active,
      meta_keywords
    } = req.body;

    await pool.query(
      `UPDATE settings SET
        hero_title = ?,
        hero_subtitle = ?,
        hero_button_text = ?,
        hero_button_link = ?,
        about_title = ?,
        about_text = ?,
        about_image = ?,
        contact_email = ?,
        contact_phone = ?,
        whatsapp_number = ?,
        office_address = ?,
        google_maps_embed = ?,
        instagram_link = ?,
        facebook_link = ?,
        linkedin_link = ?,
        tiktok_link = ?,
        meta_title = ?,
        meta_description = ?,
        promo_title = ?,
        promo_description = ?,
        promo_discount = ?,
        promo_end_date = ?,
        promo_active = ?,
        meta_keywords = ?
      WHERE id = 1`,
      [
        hero_title,
        hero_subtitle,
        hero_button_text,
        hero_button_link,
        about_title,
        about_text,
        about_image,
        contact_email,
        contact_phone,
        whatsapp_number,
        office_address,
        google_maps_embed,
        instagram_link,
        facebook_link,
        linkedin_link,
        tiktok_link,
        meta_title,
        meta_description,
        promo_title,
        promo_description,
        promo_discount,
        promo_end_date,
        promo_active,
        meta_keywords
      ]
    );

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};