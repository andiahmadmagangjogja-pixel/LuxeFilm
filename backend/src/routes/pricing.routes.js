import express from "express";
import {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
  addFeature,
  updateFeature,
  deleteFeature
} from "../controllers/pricing.controller.js";

const router = express.Router();

router.get("/", getPricing);
router.post("/", createPricing);
router.put("/:id", updatePricing);
router.delete("/:id", deletePricing);

router.get("/", getPricing);
router.post("/", createPricing);

// feature dulu
router.post("/feature", addFeature);
router.put("/feature/:id", updateFeature);
router.delete("/feature/:id", deleteFeature);

// baru yang pakai :id
router.put("/:id", updatePricing);
router.delete("/:id", deletePricing);
export default router;






