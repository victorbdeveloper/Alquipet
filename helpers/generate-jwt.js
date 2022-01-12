//IMPORTS NODE
const jwt = require("jsonwebtoken");

/*
 * Función que recibe un uid.
 * Genera un nuevo token JWT y lo devuelve.
 */
const generateJWT = (uid = "") => {
  //PROMESA QUE GENERA UN NUEVO TOKEN JWT Y LO DEVUELVE
  return new Promise((resolve, reject) => {
    const payload = { uid };

    //SE CREA EL TOKEN Y SE FIRMA PARA VERIFICAR QUE SU CREACIÓN SE HA REALIZADO EN ESTE PROYECTO
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "20 days", //tiempo en el que caduca el token
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el Token JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
