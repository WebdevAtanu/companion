import { Router } from "express";
import * as moodController from "./mood.controller";

const router = Router();

router.get("/", moodController.listMoods);
router.post("/", moodController.createMood);
router.get("/analytics", moodController.moodAnalytics);

export default router;
