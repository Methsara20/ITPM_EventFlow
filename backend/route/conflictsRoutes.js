import express from "express";
import { detectConflict } from "../controllers/conflictsController.js";

const router = express.Router();

router.post("/detect", detectConflict);

export default router;
