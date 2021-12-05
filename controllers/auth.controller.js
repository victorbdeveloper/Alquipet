const { request, response, json } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user.model");
const { generateJWT, googleVerify } = require("../helpers/index.helper");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    //VERIFICAR SI EL EMAIL EXISTE
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Usuario / password incorrectos -->(email)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //VERIFICAR SI EL USUARIO ESTA ACTIVO
    if (!user.state) {
      console.log(user);
      return res.status(400).json({
        msg: "Usuario / password incorrectos -->(state: false)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //VERIFICAR LA CONTRASEÑA
    const isValidPassword = bcryptjs.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        msg: "Usuario / password incorrectos -->(password)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //GENERAR EL JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador ",
    });
  }
};

const loginGoogleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    // const googleUser = await googleVerify(id_token);
    // console.log(googleUser);

    const { name, email, img } = await googleVerify(id_token);

    //BUSCAMOS EL EMAIL EN LA BD E IGUALAMOS EL RESULTADO DE LA BÚSQUEDA A LA VARIABLE USER
    let user = await User.findOne({ email });

    //SI EL USUARIO NO EXISTE EN LA BD, LO CREAMOS
    if (!user) {
      const data = {
        name,
        email,
        password: "asdasdasd",
        img,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    //SI EL USUARIO TIENE EL "STATE" EN FALSE EN LA BD
    if (!user.state) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado.",
      });
    }

    //GENERAR EL JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo validar",
    });
  }
};

module.exports = {
  login,
  loginGoogleSignIn,
};