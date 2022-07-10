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
  getPublisher,
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

router.get("/", getPublisher);

router.use(validatePublisherOwner);

router.patch("/delete-telemetry", deletePublisherTelemetry);

router.patch(
  "/",
  validatePublisherName(),
  handleValidationErrors,
  sanitisePublisherName(),
  renamePublisher
);

router.delete("/", deletePublisher);

export default router;
