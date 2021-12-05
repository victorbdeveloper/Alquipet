const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user.model");

const getTest = async (req = request, res = response) => {
  // al desestructurar solo estaremos recibiendo la información de los campos que deseemos, por ej,
  // aquí solo obtendríamos info de queryTest1 y queryTest2 aunque en el body se manden muchos mas campos como por ej: id, name, etc..
  // const {
  //   queryTest1,
  //   queryTest2,
  //   queryTest3 = "queryTest3 por defecto",
  // } = req.query;

  // res.json({
  //   msg: "peticion GET a /test en el user.controller.js",
  //   queryTest1,
  //   queryTest2,
  //   queryTest3,
  // });

  //si no se le pasa un indice desde el que empezar en la url el indice será 0 por defecto
  //si no se le pasa un limite en la url el limite será 5 por defecto
  const { indexFrom = 0, limit = 5 } = req.query;

  const query = { state: true };

  const [totalUsers, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(indexFrom)).limit(Number(limit)),
  ]);

  res.json({ totalUsers, users });
};

const getUser = async (req = request, res = response) => {
  const { id } = req.query;
  // const { id } = req.params;

  const user = await User.findById(id);

  res.json({
    msg: "Usuario encontrado con éxito en la Base de Datos.",
    user,
  });
};

const createUser = async (req = request, res = response) => {
  //se ha utilizado el operador rest para no tener en cuenta la información que viene en los campos previos y que al generar un usuario
  //en la bd no se almacenen posibles datos añadidos a esos campos por error o con intenciones fraudulentas
  const {
    google,
    state,
    photo,
    favorite_listings,
    published_listings,
    ...rest
  } = req.body;
  const user = new User(rest);

  //ENCRIPTAR LA PASSWORD(HACER HASH)
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(user.password, salt);

  //GUARDAR EL USUARIO EN LA BASE DE DATOS
  await user.save();

  //RESPUESTA
  res.json({
    msg: "Usuario creado y guardado en la Base de Datos con éxito.",
    rest,
  });
};

const testPut = async (req = request, res = response) => {
  // al desestructurar solo estaremos recibiendo la información de los campos que deseemos, por ej,
  // aquí solo obtendríamos info de test1 y test2 aunque en el body se manden muchos mas campos como por ej: id, name, etc..
  //const { test1, test2 } = req.body;
  const { id } = req.params;
  const { _id, email, password, google, ...rest } = req.body;

  //validar si el password existe en la BD
  if (password) {
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  //con el new:true se muestran los resultados de los cambios ya producidos
  const user = await User.findByIdAndUpdate(id, rest, { new: true });

  res.json({
    msg: "peticion PUT a /test en el user.controller.js",
    user,
  });
};

const testDelete = async (req = request, res = response) => {
  // al desestructurar solo estaremos recibiendo la información de los campos que deseemos, por ej,
  // aquí solo obtendríamos info de test1 y test2 aunque en el body se manden muchos mas campos como por ej: id, name, etc..
  //   const { test1, test2 } = req.body;

  //   res.json({
  //     msg: "peticion DELETE a /test en el user.controller.js",
  //     test1,
  //     test2,
  //   });
  // };

  const { id } = req.params;

  //BORRADO FISICO DE LA BD
  // const user = await User.findByIdAndDelete(id);

  //BORRADO CAMBIANDO EL STATE DEL USUARIO PARA QUE PERMANEZCA EN LA BD Y NO SE PIERDA LA INTEGRIDAD REFERENCIAL
  const uid = req.uid;

  const user = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true } //con el new:true se muestran los resultados de los cambios ya producidos
  );

  res.json({
    user,
    uid,
  });
};

module.exports = {
  getUser,
  createUser,
  testPut,
  testDelete,
};
