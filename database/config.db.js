//IMPORTS NODE
const mongoose = require("mongoose");

/*
 * Función anónima.
 * Establece la conexión con la base de datos establecida en las variables de entorno.
 */
const dbConnection = async () => {
  try {
    //ESTABLECE LA CONEXIÓN CON LA BASE DE DATOS
    await mongoose.connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DATABASE OnLine");
  } catch (error) {
    console.log(error);
    throw new Error("Database connection error");
  }
};

//EXPORTS
module.exports = {
  dbConnection,
};
