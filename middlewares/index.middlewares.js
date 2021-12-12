//IMPORTS DE TODA LA CARPETA MIDDLEWARES
const validateJWT = require("./validate-jwt");
const validatePetsAllowed = require("./validate-pets-allowed");
const validateFiles = require("./validate-files");
const validateRequest = require("./validate-request");

//EXPORTS -> se exportan con la desestructuración para poder usar cualquiera de los exports que tiene el propio archivo
module.exports = {
  ...validateJWT,
  ...validatePetsAllowed,
  ...validateFiles,
  ...validateRequest,
};
