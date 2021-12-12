//IMPORTS NODE
const { Router } = require("express");
const { check } = require("express-validator");

//IMPORTS PROYECTO
const { validateRequest } = require("../middlewares/validate-request");

const {
  loginEmail,
  loginGoogleSignIn,
} = require("../controllers/auth.controller");

//ROUTER DE EXRESS CON EL QUE GENERAR LAS RUTAS DE LOS ENDPOINTS DEL SERVIDOR REST
const router = Router();

//PETICION POST PARA HACER LOGIN CON EMAIL Y PASSWORD
router.post(
  "/login_email",
  [
    check("email", "El email no es válido").isEmail(),
    check("password", "El password no es válido").isLength({
      min: 6,
    }),
    validateRequest,
  ],
  loginEmail
);

//PETICIÓN POST PARA HACER LOGIN CON UNA CUENTA DE GOOGLE
router.post(
  "/login_google",
  [check("id_token", "El id_token es necesario").notEmpty(), validateRequest],
  loginGoogleSignIn
);

//EXPORTS
module.exports = router;
