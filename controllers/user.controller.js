const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user.model");

const getUser = async (req = request, res = response) => {
  const { id } = req.query;

  const user = await User.findById(id);

  res.json({
    msg: "Usuario encontrado con éxito en la Base de Datos.",
    user,
  });
};

const createUser = async (req = request, res = response) => {
  //se ha utilizado el operador rest para no tener en cuenta la información que viene en los campos previos y que al generar un usuario
  //en la bd no se almacenen posibles datos añadidos a esos campos por error o con intenciones fraudulentas
  const { google, state, photo, favorite_listings, ...rest } = req.body;
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

const updateUser = async (req = request, res = response) => {
  const { id } = req.query;
  const { password, phone, ...rest } = req.body;

  //comprueba si se le ha pasado el password o no
  if (password) {
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  //comprueba si se le ha pasado el phone o no
  if (phone) {
    rest.phone = phone;
  }

  //comprueba si no se le ha pasado ningún dato a la petición
  if (!password && !phone) {
    res.json({
      msg: "No se ha facilitado ningún dato.",
    });
  }

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

const deleteUser = async (req = request, res = response) => {
  const { id } = req.query;

  //BORRADO FISICO DE LA BD
  // const user = await User.findByIdAndDelete(id);

  //BORRADO CAMBIANDO EL STATE DEL USUARIO PARA QUE PERMANEZCA EN LA BD Y NO SE PIERDA LA INTEGRIDAD REFERENCIAL
  const user = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true } //mediante new:true se muestran los resultados de los cambios ya producidos.
  );

  res.json({
    msg: "Usuario eliminado con éxito.",
    user,
  });
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
