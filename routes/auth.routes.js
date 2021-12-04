const { Router } = require("express");
const { check } = require("express-validator");

const { validateRequest } = require("../middlewares/validate-request");
const { login, loginGoogleSignIn } = require("../controllers/auth.controller");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El email no es válido").isEmail(),
    check("password", "El password es obligatorio").isLength({
      min: 6,
    }),
    validateRequest,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "El is_token es necesario").notEmpty(), validateRequest],
  loginGoogleSignIn
);

module.exports = router;
