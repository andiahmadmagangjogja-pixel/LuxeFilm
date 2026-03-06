import express from "express";
import {
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq
} from "../controllers/faq.controller.js";

const router = express.Router();

router.get("/", getFaq);
router.post("/", createFaq);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export default router;