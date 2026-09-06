import { Router } from "express";
import * as emergencyContactController from "./emergency-contact.controller";

const router = Router();

router.get("/", emergencyContactController.listEmergencyContacts);
router.post("/", emergencyContactController.createEmergencyContact);
router.put("/:id", emergencyContactController.updateEmergencyContact);
router.delete("/:id", emergencyContactController.deleteEmergencyContact);

export default router;
