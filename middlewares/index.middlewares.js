const validateJWT = require("./validate-jwt");
const validatePetsAllowed = require("./validate-pets-allowed");
const validateFiles = require("./validate-files");
const validateRequest = require("./validate-request");

module.exports = {
  ...validateJWT,
  ...validatePetsAllowed,
  ...validateFiles,
  ...validateRequest,
};
