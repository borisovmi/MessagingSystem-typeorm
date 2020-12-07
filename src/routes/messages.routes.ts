import { Router } from "express";
import { getMessages } from "../controllers/messages.ctrl";

const router = Router();

router.get("/", getMessages);

export default router;
