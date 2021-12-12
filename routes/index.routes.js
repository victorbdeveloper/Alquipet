//IMPORTS DE TODA LA CARPETA ROUTES
const auth = require("./auth.routes");
const listings = require("./listings.routes");
const user = require("./user.routes");

//EXPORTS -> se exportan con la desestructuración para poder usar cualquiera de los exports que tiene el propio archivo
module.exports = {
  ...auth,
  ...listings,
  ...user,
};
