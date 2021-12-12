//IMPORTS NODE
const { request, response } = require("express");
const jwt = require("jsonwebtoken");

//IMPORTS PROYECTO
const User = require("../models/user.model");

/*
 * Función anónima que recibe una request y una response.
 * Valida un token JWT generado en el propio servidor.
 */
const validateJWT = async (req = request, res = response, next) => {
  const access_token = req.header("Authorization");
  const token = access_token.split(" ")[1];

  //SI NO HAY TOKEN
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    //VERIFICA LA FIRMA DEL TOKEN
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //LEER USUARIO QUE CORRESPONDE AL UID
    const user = await User.findById(uid);

    //VERIFICAR SI EL USUARIO EXISTE
    if (!user) {
      res.status(401).json({
        msg: "Token no válido --> (usuario no existe en la BD)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //VERIFICAR SI EL USUARIO AL QUE CORRESPONDE EL UID TIENE EL STATE EN TRUE
    if (!user.state) {
      res.status(401).json({
        msg: "Token no válido --> (usuario con state: false)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //VALIDA SI EL USUARIO OBTENIDO AL DECODIFICAR EL TOKEN Y EL USUARIO OBTENIDO AL BUSCAR POR EL ID PROPORCIONADO POR EL TOKEN, SON EL MISMO
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

//EXPORTS
module.exports = {
  validateJWT,
};
