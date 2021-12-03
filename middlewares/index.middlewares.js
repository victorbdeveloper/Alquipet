const  validateJWT  = require("./validate-jwt");
const  validateRequest  = require("./validate-request");

module.exports = {
    ...validateJWT,
    ...validateRequest,
}