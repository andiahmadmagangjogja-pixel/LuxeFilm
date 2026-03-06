import bcrypt from "bcryptjs";
import { findUserByEmail } from "../models/auth.model.js";
import { generateToken } from "../utils/token.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
  console.log("LOGIN ERROR:", error);
  res.status(500).json({ message: error.message });
}

};
