require("dotenv").config();

//*parte de express...web server y rest server
const express = require("express");
const app = express();

const main = async () => {
  //*prueba inicial de funcionamiento
  console.log("Hola Mundo!!!!!!");

  //*prueba del paquete dotenv
  //console.log(process.env);
  //console.log(process.env.MAPBOX_KEY);

  //*PARTE DE EXPRESS
  //*SERVIR CONTENIDO ESTATICO PROPORCIONADO POR EL INDEX.HTML DE LA CARPETA PUBLIC
  app.use(express.static("public"));

  //*SERVIR CONTENIDO ESTATICO PROPORCIONADO POR UN ARCHIVO DE LA CARPETA PUBLIC QUE NO SEA EL INDEX
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/404.html");
  });

  //*SERVIR CONTENIDO PROPORCIONADO POR LA RUTA A LA QUE SE NAVEGE
  //El contenido de la carpeta public tiene prioridad sobre el contenido obtenido por la ruta, por eso
  //se han comentado estas lineas de codigo ya que nunca se ejecutaran
  // app.get("/", (req, res) => {
  //   res.send("Hello World desde /");
  // });
  //
  // app.get("*", (req, res) => {
  //   res.send("404 | Page not found --> desde EXPRESS!!!!!!!!");
  // });

  app.get("/holamundo", (req, res) => {
    res.send("Hello World desde /holamundo");
  });

  app.listen(process.env.PORT);
};

main();
