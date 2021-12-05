const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger_output.json");

const { dbConnection } = require("../database/config.db");

/*
 * CLASE CON LA QUE SE INICIA UN SERVIDOR DE EXPRESS Y QUE CONTIENE EJEMPLOS DE DISTINTOS ENDPOINTS
 */
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      listings: "/api/listings",
      users: "/api/users",
    };

    //*CONECTAR A BASE DE DATOS
    this.connectionDB();

    //* MIDDLEWARES
    this.middlewares();

    //* RUTAS DE MI APLICACIÓN
    this.routes();

    //*SWAGGER GENERATE DOCUMENTATION
    this.app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
  }

  async connectionDB() {
    await dbConnection();
  }

  //* los middlewares es lo primero que se ejecuta en las peticiones (es el punto entre medias de la petición y el endPoint, mas o menos)
  middlewares() {
    //*CORS
    this.app.use(cors());

    //*LECTURA Y PARSEO DEL BODY
    this.app.use(express.json());

    //*SERVIR CONTENIDO ESTATICO PROPORCIONADO POR EL INDEX.HTML DE LA CARPETA PUBLIC
    this.app.use(express.static("public"));
  }

  //*SERVIR CONTENIDO PROPORCIONADO POR LA RUTA A LA QUE SE NAVEGE
  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.listings, require("../routes/listings.routes"));
    this.app.use(this.paths.users, require("../routes/users.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto: ", this.port);
    });
  }
}

module.exports = Server;
