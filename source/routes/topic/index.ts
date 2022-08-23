import express from "express";

import { handleValidationErrors } from "../../middleware/validation";
import { validateTopicName, sanitiseTopicName } from "./middleware";
import { authoriseUser } from "../../middleware/authorisation";
import {
  createTopic,
  getAllTopics,
  getTopic,
  updateTopicName,
  deleteTopic,
} from "./controllers";

const router = express.Router();

router.use(authoriseUser);

router.post(
  "/create",
  validateTopicName(),
  handleValidationErrors,
  sanitiseTopicName(),
  createTopic
);

router.get("/list", getAllTopics);

router.get("/:topicId", getTopic);

router.patch(
  "/rename/:topicId",
  validateTopicName(),
  handleValidationErrors,
  sanitiseTopicName(),
  updateTopicName
);

router.delete("/:topicId", deleteTopic);

export default router;
