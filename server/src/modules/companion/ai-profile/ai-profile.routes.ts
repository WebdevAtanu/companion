import { Router } from "express";
import * as aiProfileController from "./ai-profile.controller";

const router = Router();

router.get("/", aiProfileController.getAIProfile);
router.put("/", aiProfileController.updateAIProfile);

export default router;
