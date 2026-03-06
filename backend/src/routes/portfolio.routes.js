import express from "express";
import {
  getPortfolio,
  addPortfolio,
  editPortfolio,
  removePortfolio,
  
} from "../controllers/portfolio.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";


const router = express.Router();

router.get("/", getPortfolio);
router.post("/", upload.single("image"), addPortfolio);
router.put("/:id", verifyToken, editPortfolio);
router.delete("/:id", verifyToken, removePortfolio);

export default router;
