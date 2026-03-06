import {
  getAllPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../models/portfolio.model.js";

export const getPortfolio = async (req, res) => {
  const data = await getAllPortfolio();
  res.json(data);
};


export const addPortfolio = async (req, res) => {
  try {
    const { title, category } = req.body;

    const image_url = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    await createPortfolio({
      title,
      description: null, // 🔥 wajib ada karena model minta
      image_url,
      category,
    });

    res.json({ message: "Portfolio berhasil ditambahkan" });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
  



export const editPortfolio = async (req, res) => {
  try {
    const { title, category } = req.body;

    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url; // fallback gambar lama

    await updatePortfolio(req.params.id, {
      title,
      category,
      image_url,
    });

    res.json({ message: "Portfolio berhasil diupdate" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const removePortfolio = async (req, res) => {
  await deletePortfolio(req.params.id);
  res.json({ message: "Portfolio berhasil dihapus" });
};

