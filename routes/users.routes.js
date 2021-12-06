const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateJWT,
  validateRequest,
} = require("../middlewares/index.middlewares");

const {
  // isRoleValid,
  isUserNameValid,
  isEmailValid,
  userExistsById,
} = require("../helpers/db-validators");

const {
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

const router = Router();

//devolución de un text/html (no es común devolver un texto directamente, es mejor devolver un JSON)
router.get("/holamundo", (req, res) => {
  res.send("Hello World desde /api/users/holamundo");
});

//PETICIÓN GET
router.get(
  /* 
    #swagger.tags = ['Users']
    #swagger.path = ['/users/get_user', ]
    #swagger.description = 'Endpoint para buscar un usuario en la BD por su id y obtenerlo en la respuesta de la petición.'

  */
  "/get_user",
  [
    validateJWT,
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(userExistsById),
    validateRequest,
  ],
  getUser
);

//PETICIÓN POST
router.post(
  /* 
    #swagger.tags = ['Users']
    #swagger.path = ['/users/create_user', ]
    #swagger.description = 'Endpoint para crear un usuario y añadirlo a la BD.'

  */
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
    check("phone", "El teléfono es obligatorio").notEmpty(),
    check("phone", "El teléfono no es correcto").isMobilePhone(),
    //check("role", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    //check("role").custom(isRoleValid),
    validateRequest,
  ],
  createUser
);

//PETICIÓN PUT
router.put(
  /* 
    #swagger.tags = ['Users']
    #swagger.path = ['/users/update_user', ]
    #swagger.description = 'Endpoint para modificar un usuario ya creado en la BD.'

  */
  "/update_user",
  [
    validateJWT,
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(userExistsById),
    check("password", "El password es obligatorio").notEmpty(),
    check("password", "El password debe tener mas de 6 dígitos").isLength({
      min: 6,
    }),
    check("phone", "El teléfono es obligatorio").notEmpty(),
    check("phone", "El teléfono no es correcto").isMobilePhone(),
    //check("role").custom(isRoleValid),
    validateRequest,
  ],
  updateUser
);

//PETICIÓN DELETE
router.delete(
  /* 
    #swagger.tags = ['Users']
    #swagger.path = ['/users/delete_user', ]
    #swagger.description = 'Endpoint para buscar un usuario en la BD por su id y borrarlo estableciendo el valor del campo state en false.'

  */
  "/delete_user",
  [
    validateJWT,
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(userExistsById),
    validateRequest,
  ],
  deleteUser
);

module.exports = router;
