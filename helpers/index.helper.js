const dbValidators = require("./db-validators");
const generateJWS = require("./generate-jwt");
const googleVerify = require("./google-verify");
const generateLatLong = require("./generate-latlong");
const cloudinaryFiles = require("./cloudinary-files");

module.exports = {
  ...dbValidators,
  ...generateJWS,
  ...googleVerify,
  ...generateLatLong,
  ...cloudinaryFiles,
};
