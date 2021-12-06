const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
  const access_token = req.header("Authorization");
  const token = access_token.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
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

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validateJWT,
};
