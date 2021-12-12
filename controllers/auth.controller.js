//IMPORTS NODE
const { request, response, json } = require("express");
const bcryptjs = require("bcryptjs");

//IMPORTS PROYECTO
const User = require("../models/user.model");
const { generateJWT, googleVerify } = require("../helpers/index.helper");

/*
 * Función anónima asíncrona que recibe por parámetros la request y la response.
 * Permite realizar el login utilizando un email y una contraseña.
 */
const loginEmail = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    //VERIFICA SI EL EMAIL EXISTE
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Email / password incorrectos -->(email)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //VERIFICA SI EL USUARIO ESTA ACTIVO
    if (!user.state) {
      return res.status(400).json({
        msg: "Email / password incorrectos -->(state: false)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //VERIFICA LA CONTRASEÑA
    const isValidPassword = bcryptjs.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        msg: "Email / password incorrectos -->(password)", //borrar luego la ultima parte para no dar pistas del error
      });
    }

    //GENERA EL JWT
    const token = await generateJWT(user.id);

    //RESPUESTA
    res.json({
      msg: "Login correcto. Bienvenido.",
      user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Algo salió mal. Hable con el administrador del sistema.",
    });
  }
};

/*
 * Función anónima asíncrona que recibe por parámetros la request y la response.
 * Permite realizar el login utilizando un email y una contraseña de una cuenta de Google.
 */
const loginGoogleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { given_name, family_name, email } = await googleVerify(id_token);

    //SE BUSCA EL EMAIL EN LA BD Y SE IGUALA EL RESULTADO DE LA BÚSQUEDA A LA VARIABLE USER
    let user = await User.findOne({ email });

    //SI EL USUARIO NO EXISTE EN LA BD, SE CREA UNO NUEVO CON LOS DATOS OBTENIDOS DEL TOKEN DE GOOGLE
    if (!user) {
      const data = {
        user_name: email.split("@")[0],
        name: given_name,
        last_name: family_name,
        email: email,
        password: "*",
        phone: "",
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    //SI EL USUARIO TIENE EL "STATE" EN FALSE EN LA BD
    if (!user.state) {
      return res.status(401).json({
        msg: "Usuario bloqueado. Hable con el administrador.",
      });
    }

    //GENERAR EL JWT
    const token = await generateJWT(user.id);

    //RESPUESTA
    res.json({
      msg: "Login correcto. Bienvenido.",
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

//EXPORTS
module.exports = {
  loginEmail,
  loginGoogleSignIn,
};
