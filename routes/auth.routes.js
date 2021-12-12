const { Router } = require("express");
const { check } = require("express-validator");

const { validateRequest } = require("../middlewares/validate-request");

const {
  loginEmail,
  loginGoogleSignIn,
} = require("../controllers/auth.controller");

const router = Router();

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

router.post(
  "/login_google",
  [check("id_token", "El id_token es necesario").notEmpty(), validateRequest],
  loginGoogleSignIn
);

module.exports = router;
