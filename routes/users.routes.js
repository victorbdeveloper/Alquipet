//IMPORTS NODE
const { Router } = require("express");
const { check } = require("express-validator");

//IMPORTS PROYECTO
const {
  validateJWT,
  validateRequest,
} = require("../middlewares/index.middlewares");

const {
  isUserNameValid,
  isEmailValid,
  userExistsById,
} = require("../helpers/index.helper");

const {
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

//ROUTER DE EXRESS CON EL QUE GENERAR LAS RUTAS DE LOS ENDPOINTS DEL SERVIDOR REST
const router = Router();

//PETICIÓN GET PARA DEVOLVER UN USUARIO POR SU ID
router.get(
  "/get_user",
  [
    validateJWT,
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(userExistsById),
    validateRequest,
  ],
  getUser
);

//PETICIÓN POST PARA CREAR UN USUARIO
router.post(
  "/create_user",
  [
    check("user_name", "El nombre de usuario es obligatorio").notEmpty(),
    check("user_name").custom(isUserNameValid),
    check("name", "El nombre es obligatorio").notEmpty(),
    check("last_name", "El apellido es obligatorio").notEmpty(),
    check("email", "El email es obligatorio").notEmpty(),
    check("email", "El email no es correcto").isEmail(),
    check("email").custom(isEmailValid),
    check("password", "El password es obligatorio").notEmpty(),
    check("password", "El password debe tener mas de 6 dígitos").isLength({
      min: 6,
    }),
    check("phone", "El teléfono no tiene un formato válido")
      .optional(true)
      .isMobilePhone(),
    validateRequest,
  ],
  createUser
);

//PETICIÓN PUT PARA MODIFICAR UN USUARIO
router.put(
  "/update_user",
  [
    validateJWT,
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(userExistsById),
    check("password", "El password debe tener mas de 6 dígitos")
      .optional(true)
      .isLength({
        min: 6,
      }),
    check("phone", "El teléfono no es correcto").optional(true).isMobilePhone(),
    validateRequest,
  ],
  updateUser
);

//PETICIÓN DELETE PARA BORRAR A UN USUARIO
router.delete(
  "/delete_user",
  [
    validateJWT,
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(userExistsById),
    validateRequest,
  ],
  deleteUser
);

//EXPORTS
module.exports = router;
