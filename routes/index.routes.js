const auth = require("./auth.routes");
const listings = require("./listings.routes");
const user = require("./user.routes");

module.exports = {
  ...auth,
  ...listings,
  ...user,
};
