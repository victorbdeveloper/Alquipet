require("dotenv").config();

//* parte del restServer... peticiones desde el Front
const Server = require("./models/server.model");

const main = async () => {
  //*PARTE DEL RESTSERVER CON EXPRESS
  const server = new Server();
  server.listen();
};

main();
