//IMPORTS PROYECTO
const User = require("../models/user.model");
const Listing = require("../models/listing.model");

/*
 * Función anónima que recibe un nombre de usuario.
 * Valida si el nombre del usuario ya existe en la BD.
 */
const isUserNameValid = async (user_name = "") => {
  //BUSCA EL USUARIO POR SU NOMBRE DE USUARIO
  const userNameExists = await User.findOne({ user_name });

  if (userNameExists) {
    throw new Error(`El nombre de usuario ${user_name} ya esta registrado`);
  }
};

/*
 * Función anónima que recibe un email.
 * Valida si el correo electrónico del usuario ya existe en la BD.
 */
const isEmailValid = async (email = "") => {
  //BUSCA EL USUARIO POR SU EMAIL
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new Error(`El email ${email} ya esta registrado`);
  }
};

/*
 * Función anónima que recibe un id de usuario.
 * Valida si el usuario existe en la BD.
 */
const userExistsById = async (id = "") => {
  //BUSCA EL USUARIO POR SU ID
  const userExists = await User.findById({ _id: id });

  if (!userExists) {
    throw new Error(`El usuario con id ${id} no existe`);
  }
};

/*
 * Función anónima que recibe un id de anuncio.
 * Valida si el anuncio existe en la BD.
 */
//VERIFICAR SI EXISTE EL ANUNCIO BUSCANDO POR SU ID DE MONGO EN LA BD
const listingExistsById = async (id = "") => {
  //BUSCA EL ANUNCIO POR SU ID
  const listingExists = await Listing.findById({ _id: id });

  if (!listingExists) {
    throw new Error(`El anuncio con id ${id} no existe`);
  }
};

//EXPORTS
module.exports = {
  isUserNameValid,
  isEmailValid,
  userExistsById,
  listingExistsById,
};
