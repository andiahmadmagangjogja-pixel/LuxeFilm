import express from "express";
import { getWorkProcess,
     createWorkProcess,
     updateWorkProcess,
     deleteWorkProcess,

 } from "../controllers/workProcess.controller.js";

const router = express.Router();

router.get("/", getWorkProcess);
router.post("/", createWorkProcess);
router.put("/:id", updateWorkProcess);
router.delete("/:id", deleteWorkProcess);
export default router;