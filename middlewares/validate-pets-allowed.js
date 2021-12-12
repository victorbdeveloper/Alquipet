//IMPORTS NODE
const { request, response } = require("express");

/*
 * Función anónima que recibe una request y una response.
 * Valida las mascotas enviadas en la petición.
 */
const validatePetsAllowed = async (req = request, res = response, next) => {
  const { dogs, cats, birds, rodents, exotic, ...rest } = req.body;

  //VALIDA SI NO SE SELECCIONÓ NINGUNA MASCOTA
  if (
    dogs === undefined &&
    cats === undefined &&
    birds === undefined &&
    rodents === undefined &&
    exotic === undefined
  ) {
    return res.status(400).json({
      msg: "Se debe añadir al menos un tipo de mascota admitida en el anuncio",
    });
  }

  next();
};

//EXPORTS
module.exports = {
  validatePetsAllowed,
};
