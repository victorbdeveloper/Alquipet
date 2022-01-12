//IMPORTS NODE
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

//IMPORTS PROYECTO
const { dbConnection } = require("../database/config.db");

/*
 * CLASE CON LA QUE SE INICIA UN SERVIDOR DE EXPRESS Y QUE CONTIENE EJEMPLOS DE DISTINTOS ENDPOINTS
 */
class Server {
  //CONSTRUCTOR DE LA CLASE
  constructor() {
    //*INSTANCIA DE EXPRESS PARA GENERAR LAS RUTAS
    this.app = express();

    //*PUERTO UTILIZADO PARA LAS RUTAS
    this.port = process.env.PORT;

    //*PATHS DE LAS RUTAS DEFINIDAS
    this.paths = {
      auth: "/api/auth",
      listings: "/api/listings",
      users: "/api/users",
    };

    //* MIDDLEWARES
    this.middlewares();

    //*CONECTAR A BASE DE DATOS
    this.connectionDB();

    //* RUTAS DE MI APLICACIÓN
    this.routes();
  }

  //REALIZA LA CONEXIÓN A LA BASE DE DATOS
  async connectionDB() {
    await dbConnection();
  }

  //* los middlewares es lo primero que se ejecuta en las peticiones (es el punto entre medias de la petición y el endPoint, mas o menos)
  middlewares() {
    //*CORS
    // this.app.use(cors());
    this.app.use(
      cors({
        origin: ["http://localhost:8081", "https://www.alquipet.com"],
        credentials: true,
      })
    );

    //*LECTURA Y PARSEO DEL BODY
    this.app.use(express.json());

    //*SERVIR CONTENIDO ESTATICO PROPORCIONADO POR EL INDEX.HTML DE LA CARPETA PUBLIC
    this.app.use(express.static("public"));

    //*Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  //*SERVIR CONTENIDO PROPORCIONADO POR LA RUTA A LA QUE SE NAVEGE
  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.listings, require("../routes/listings.routes"));
    this.app.use(this.paths.users, require("../routes/users.routes"));
  }

  //*PUERTO POR EL QUE SE ESTARÁN ESCUCHANDO LAS PETICIONES
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto: ", this.port);
    });
  }
}

//EXPORTS
module.exports = Server;
