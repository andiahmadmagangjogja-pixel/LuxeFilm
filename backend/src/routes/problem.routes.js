import express from "express";
import { getProblems,
  createProblem,
  updateProblem,
  deleteProblem,

 } from "../controllers/problem.controller.js";

const router = express.Router();

router.get("/", getProblems);
router.post("/", createProblem);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

export default router;