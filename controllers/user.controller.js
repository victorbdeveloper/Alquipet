//IMPORTS NODE
const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

//IMPORTS PROYECTO
const User = require("../models/user.model");

/*
 * Función anónima que recibe la request y la response.
 * Obtiene el usuario buscandolo por su ID.
 */
const getUser = async (req = request, res = response) => {
  const { id } = req.query;

  //BUSCA AL USUARIO EN LA BD MEDIANTE SU ID
  const user = await User.findById(id);

  //RESPUESTA
  res.json({
    msg: "Usuario encontrado con éxito en la Base de Datos.",
    user,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Crea un usuario y lo guarda en la BD.
 */
const createUser = async (req = request, res = response) => {
  const { google, state, photo, favorite_listings, ...rest } = req.body;

  const user = new User(rest);

  //ENCRIPTA LA PASSWORD(HACER HASH)
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(user.password, salt);

  //GUARDA EL USUARIO EN LA BASE DE DATOS
  await user.save();

  //RESPUESTA
  res.json({
    msg: "Usuario creado y guardado en la Base de Datos con éxito.",
    rest,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Modifica un usuario y lo guarda en la BD.
 */
const updateUser = async (req = request, res = response) => {
  const { id } = req.query;
  const { password, phone, ...rest } = req.body;

  //SE VALIDA SI SE HA ENVIADO LA CONTRASEÑA PARA MODIFICARLA
  if (password) {
    //ENCRIPTA LA CONTRASEÑA
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  //SE VALIDA SI SE HA ENVIADO EL TELEFONO PARA MODIFICARLO
  if (phone) {
    rest.phone = phone;
  }

  //SI NO SE HA ENVIADO NINGÚN DATO QUE MODIFCAR
  if (!password && !phone) {
    res.json({
      msg: "No se ha facilitado ningún dato.",
    });
  }

  //BUSCA AL USUARIO EN LA BD POR SU ID Y LO MODIFICA
  const user = await User.findByIdAndUpdate(
    id,
    { password: rest.password, phone: rest.phone },
    { new: true } //con new:true se muestran los resultados de los cambios ya producidos
  );

  res.json({
    msg: "Usuario modificado con éxito.",
    user,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Elimina un usuario de la BD.
 */
const deleteUser = async (req = request, res = response) => {
  const { id } = req.query;

  //*BORRADO FISICO DE LA BD --> se ha decidido utilizar el otro sistema de "borrado"
  //const user = await User.findByIdAndDelete(id);

  //*BORRADO CAMBIANDO EL STATE DEL USUARIO A FALSE PARA QUE PERMANEZCA EN LA BD Y NO SE PIERDA LA INTEGRIDAD REFERENCIAL
  //SE BUSCA AL USUARIO EN LA BD POR SU ID Y SE LE CAMBIA EL ESTADO A FALSO
  const user = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true } //mediante new:true se muestran los resultados de los cambios ya producidos.
  );

  //RESPUESTA
  res.json({
    msg: "Usuario eliminado con éxito.",
    user,
  });
};

//EXPORTS
module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
