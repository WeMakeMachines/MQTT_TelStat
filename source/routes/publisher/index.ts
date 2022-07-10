import express from "express";

import { handleValidationErrors } from "../../middleware/validation";
import {
  validatePublisherName,
  validatePublisherOwner,
  sanitisePublisherName,
} from "./middleware";
import { authoriseUser } from "../../middleware/authorisation";
import {
  createPublisher,
  deletePublisher,
  deletePublisherTelemetry,
  getPublisherList,
  getPublisherById,
  renamePublisher,
} from "./controllers";

const router = express.Router();

router.use(authoriseUser);

router.post(
  "/create",
  validatePublisherName(),
  handleValidationErrors,
  sanitisePublisherName(),
  createPublisher
);

router.get("/list", getPublisherList);

router.get("/:publisherId", getPublisherById);

router.use(validatePublisherOwner);

router.patch("/delete-telemetry/:publisherId", deletePublisherTelemetry);

router.patch(
  "/rename/:publisherId",
  validatePublisherName(),
  handleValidationErrors,
  sanitisePublisherName(),
  renamePublisher
);

router.delete("/:publisherId", deletePublisher);

export default router;
