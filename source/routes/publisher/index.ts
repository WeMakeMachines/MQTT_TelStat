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
  getAllPublishers,
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

router.get("/all", getAllPublishers);

router.get("/", getPublisher);

router.patch(
  "/",
  validatePublisherOwner,
  validatePublisherName(),
  handleValidationErrors,
  sanitisePublisherName(),
  renamePublisher
);

router.delete("/", validatePublisherOwner, deletePublisher);

export default router;
