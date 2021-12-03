const { Schema, model } = require("mongoose");

const ListingSchema = Schema({
  state: {
    type: Boolean,
    required: [true, "Establecer el estado del anuncio es obligatorio"],
    default: true,
  },
  address: {
    type: String, //TODO: revisar si es un String o un ObjectId de la tabla Address
    required: [true, "Establecer la dirección del anuncio es obligatorio"],
  },
  date_publication: {
    type: Date, //TODO: revisar si el campo es un Date o es otro tipo de dato
    required: [true, "Establecer la fecha del anuncio es obligatorio"],
    default: Date.now, //TODO: revisar si es la manera correcta de poner la fecha actual
  },
  pets_allowes: {
    type: String, //TODO: revisar si es un String o un ObjectId de la tabla Pets_allowed
    required: [
      true,
      "Establecer las mascotas admitidas en el anuncio es obligatorio",
    ],
  },
  //TODO: comprobar como realizar un campo de tipo lista que hace referencia a otra tabla -> List<Photo>
  photos: {
    type: String,
  },
  price: {
    type: Number, //TODO: revisar si es la manera correcta de poner un campo tipo int
    required: [
      true,
      "Establecer el precio del piso en el anuncio es obligatorio",
    ],
  },
  description: {
    type: String,
  },
});

//TODO: CAMBIARA POR LOS DATOS DEL LISTING
ListingSchema.methods.toJSON = function () {
  // const { __v, _id, password, ...user } = this.toObject();
  // user.uid = _id;
  // return user;
};

module.exports = model("Listing", ListingSchema);
