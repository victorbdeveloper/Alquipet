const auth = require("./auth.controller");
const listing = require("./listing.controller");
const user = require("./user.controller");

module.exports = {
  ...auth,
  ...listing,
  ...user,
};
