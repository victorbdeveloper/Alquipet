//IMPORTS DE TODA LA CARPETA CONTROLLERS
const auth = require("./auth.controller");
const listing = require("./listing.controller");
const user = require("./user.controller");

//EXPORTS -> se exportan con la desestructuración para poder usar cualquiera de los exports que tiene el propio archivo
module.exports = {
  ...auth,
  ...listing,
  ...user,
};
