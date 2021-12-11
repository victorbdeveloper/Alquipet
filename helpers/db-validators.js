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

//VERIFICAR SI UN ANUNCIO PERTENECE A UN USUARIO
const listingCreatedByCurrentUser = async (id_listing = "", id_user = "") => {
  const result = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  if (!result) {
    throw new Error(
      `El anuncio con id ${id_listing} no pertenece al usuario`
    );
  }
};

//VERIFICAR SI UN ANUNCIO QUE QUIERE AÑADIRSE A FAVORITOS YA ESTA AÑADIDO A LOS FAVORITOS DEL USUARIO
const listingAlredysFavorite = async (id_listing = "", id_user = "") => {
  const result = await User.find({
    favorite_listings: id_listing,
  });
  console.log(result.length);

  if (result.length > 0) {
    throw new Error( 
      `El anuncio con id ${id_listing} ya esta añadido a la lista de favoritos del usuario`
    );
  }
};

//TODO:!!!!!!!!!
//VERIFICAR SI CADA FOTO DE UN ARRAY DE FOTOS PERTENECE AL ANUNCIO QUE HA PUBLICADO EL MISMO USUARIO QUE QUIERE BORRRAR LAS FOTOS
const photoInListingCreatedByCurrentUser = async (
  id_listing = "",
  id_user = ""
) => {
  const result = Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  if (!result) {
    throw new Error(
      `El anuncio con id ${id_listing} no pertenece al usuario con id ${id_user}`
    );
  }
};

module.exports = {
  isUserNameValid,
  isEmailValid,
  userExistsById,
  listingExistsById,
  listingCreatedByCurrentUser,
  listingAlredysFavorite,
  photoInListingCreatedByCurrentUser,
};
