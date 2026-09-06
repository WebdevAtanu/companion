import { Router } from "express";
import * as journalController from "./journal.controller";

const router = Router();

router.get("/", journalController.listJournals);
router.post("/", journalController.createJournal);
router.get("/:id", journalController.getJournal);
router.put("/:id", journalController.updateJournal);
router.delete("/:id", journalController.deleteJournal);

export default router;
