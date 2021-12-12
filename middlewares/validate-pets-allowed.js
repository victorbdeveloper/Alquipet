const { request, response } = require("express");

const validatePetsAllowed = async (req = request, res = response, next) => {
  const { dogs, cats, birds, rodents, exotic, ...rest } = req.body;

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

  next(); // es para continuar
};

module.exports = {
  validatePetsAllowed,
};
