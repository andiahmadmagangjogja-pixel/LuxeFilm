import express from "express";
import {  getWhyChoose,
  createWhyChoose,
  updateWhyChoose,
  deleteWhyChoose,

} from "../controllers/whychoose.controller.js";
const router = express.Router();

router.get("/", getWhyChoose);
router.post("/", createWhyChoose);
router.put("/:id", updateWhyChoose);
router.delete("/:id", deleteWhyChoose);

export default router;