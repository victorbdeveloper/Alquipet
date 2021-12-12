//IMPORTS NODE
require("dotenv").config();

//IMPORTS PROYECTO
const Server = require("./models/server.model");

//FUNCIÓN DE ENTRADA AL PROYECTO
const main = async () => {
  //*PARTE DEL RESTSERVER CON EXPRESS
  const server = new Server();
  server.listen();
};

main();
