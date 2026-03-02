import { Router } from "express";
import { submitConsult, getConsults } from "../controllers/consultController";
import { validateConsult } from "../middleware/validation";

const router = Router();

router.post("/submit", validateConsult, submitConsult);
router.get("/consults", getConsults);

export default router;
