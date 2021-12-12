const User = require("../models/user.model");
const Listing = require("../models/listing.model");

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
    throw new Error(`El usuario con id ${id} no existe`);
  }
};

//VERIFICAR SI EXISTE EL ANUNCIO BUSCANDO POR SU ID DE MONGO EN LA BD
const listingExistsById = async (id = "") => {
  const listingExists = await Listing.findById({ _id: id });
  if (!listingExists) {
    throw new Error(`El anuncio con id ${id} no existe`);
  }
};

module.exports = {
  isUserNameValid,
  isEmailValid,
  userExistsById,
  listingExistsById,
};
