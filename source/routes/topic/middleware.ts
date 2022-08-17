import { body } from "express-validator";

export const validateTopicName = () => [body("name").isString()];

export const sanitiseTopicName = () => {
  const charsNumbers = "0123456789";
  const charsAz = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";

  return [
    body("name").trim().whitelist(`${charsAz}${charsNumbers}`).toLowerCase(),
  ];
};
