import express from "express";

import { handleValidationErrors } from "../../middleware/validation";
import { validateTopicName, sanitiseTopicName } from "./middleware";
import { authoriseUser } from "../../middleware/authorisation";
import {
  createTopic,
  deleteTopic,
  getAllTopics,
  getTopic,
  renameTopic,
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

router.get("/all", getAllTopics);

router.get("/:topicId", getTopic);

router.delete("/:topicId", deleteTopic);

router.patch(
  "/",
  validateTopicName(),
  handleValidationErrors,
  sanitiseTopicName(),
  renameTopic
);

router.patch("/add-publisher", addPublisherToTopic);

export default router;
