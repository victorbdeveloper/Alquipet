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
  testDelete,
} = require("../controllers/user.controller");

const router = Router();

//devolución de un text/html (no es común devolver un texto directamente, es mejor devolver un JSON)
router.get("/holamundo", (req, res) => {
  res.send("Hello World desde /api/users/holamundo");
});

//PETICIÓN GET
router.get(
  /* 
    #swagger.tags = ['User']
    #swagger.path = ['/users/find_by_id', ]
    #swagger.description = 'Endpoint para buscar y obtener un usuario por su id.'

  */
  "/find_by_id",
  [
    check("id", "El id debe de ser de mongo").isMongoId(),
    check("id").custom(userExistsById),
    validateRequest,
  ],
  getUser
);

//PETICIÓN POST
router.post(
  /* 
    #swagger.tags = ['User']
    #swagger.path = ['/users/create_user', ]
    #swagger.description = 'Endpoint para crear un usuario.'

  */
  "/create_user",
  [
    check("user_name", "El nombre de usuario es obligatorio").not().isEmpty(),
    check("user_name").custom(isUserNameValid),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("last_name", "El apellido es obligatorio").not().isEmpty(),
    check("email", "El email no es correcto").isEmail(),
    check("email").custom(isEmailValid),
    check("password", "El password debe tener mas de 6 dígitos").isLength({
      min: 6,
    }),
    check("phone", "El teléfono no es correcto").isMobilePhone(),
    // check("role", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    //check("role").custom(isRoleValid),
    validateRequest,
  ],
  createUser
);

//PETICIÓN PUT
router.put(
  "/:id",
  [
    check("id", `El id no es un id valido de mongo`).isMongoId(),
    check("id").custom(userExistsById),
    //check("role").custom(isRoleValid),
    validateRequest,
  ],
  getUser
);

//PETICIÓN DELETE
router.delete(
  "/:id",
  [
    validateJWT,
    check("id", `El id no es un id valido de mongo`).isMongoId(),
    check("id").custom(userExistsById),
    validateRequest,
  ],
  testDelete
);

module.exports = router;
