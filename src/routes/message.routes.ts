import { Router } from "express";
import { body, param } from "express-validator";
import {
  deleteMessage,
  getMessage,
  postMessage,
  readMessage,
} from "../controllers/message.ctrl";
import { hasValidationErrors } from "../middlewares/validation.mw";

const router = Router();

router.post("/", body("receiver").isEmail(), hasValidationErrors, postMessage);

router.patch(
  "/:messageId/read",
  param("messageId")
    .exists()
    .isInt({ gt: 0 })
    .withMessage("Message id should be a number"),
  hasValidationErrors,
  readMessage
);

router.get(
  "/:messageId",
  param("messageId")
    .exists()
    .isInt({ gt: 0 })
    .withMessage("Message id should be a number"),
  hasValidationErrors,
  getMessage
);

router.delete(
  "/:messageId",
  param("messageId")
    .exists()
    .isInt({ gt: 0 })
    .withMessage("Message id should be a number"),
  hasValidationErrors,
  deleteMessage
);

export default router;
