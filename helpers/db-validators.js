const User = require("../models/user.model");

//  const { Address, Listing, Pets_allowed, Photo, User } = require('../models');

//VERIFICAR SI EL ROL ES VALIDO
// const isRoleValid = async (role = "") => {
//   const roleExist = await Role.findOne({ role });
//   if (!roleExist) {
//     throw new Error(`El rol ${role} no esta registrado en la BD`);
//   }
// };

//VERIFICAR SI EL USER_NAME EXISTE
const isUserNameValid = async (user_name = "") => {
  const userNameExists = await User.findOne({ user_name });
  if (userNameExists) {
    throw new Error(`El nombre de usuario ${user_name} ya esta registrado`);
  }
};

//VERIFICAR SI EL CORREO EXISTE
const isEmailValid = async (email = "") => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error(`El email ${email} ya esta registrado`);
  }
};

//VERIFICAR SI EXISTE EL USUARIO BUSCANDO POR SU ID DE MONGO EN LA BD
const userExistsById = async (id = "") => {
  const userExists = await User.findById({ _id: id });
  if (!userExists) {
    throw new Error(`El id ${id} no existe`);
  }
};

module.exports = {
  isUserNameValid,
  isEmailValid,
  userExistsById,
};
