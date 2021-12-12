//IMPORTS NODE
const { validationResult } = require("express-validator");

/*
 * Función anónima que recibe una request y una response.
 * Valida que todos los middlewares comprobados anteriormente en esta petición no dieran error.
 */
const validateRequest = (req = request, res = response, next) => {
  const errors = validationResult(req);

  //SI ALGUNO DE LOS MIDDLEWARES ANTERIORES HA DADO ERROR
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

//EXPORTS
module.exports = {
  validateRequest,
};
