const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  user_name: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  last_name: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La password es obligatoria"],
  },
  phone: {
    type: String,
    required: [true, "El teléfono es obligatorio"],
  },
  google: {
    type: Boolean,
    required: [
      true,
      "Establecer si el tipo de acceso se ha realizado mediante google es obligatorio",
    ],
    default: false,
  },
  state: {
    type: Boolean,
    required: [true, "Establecer el estado de la cuenta es obligatorio"],
    default: true,
  },
  photo: {
    type: String, //TODO: revisar si es un String o un ObjectId de la tabla Photo
  },
  //TODO: comprobar como realizar un campo de tipo lista que hace referencia a otra tabla -> List<Listing>
  favorite_listings: {
    type: String,
  },
  //TODO: comprobar como realizar un campo de tipo lista que hace referencia a otra tabla -> List<Listing>
  published_listings: {
    type: String,
  },

  // role: {
  //   type: String,
  //   required: true,
  //   default: "USER_ROLE",
  //   enum: ["ADMIN_ROLE", "USER_ROLE"],
  // },
});

//TODO: VERIFICAR ESTOS DATOS YA QUE EL USUARIO NO ES EXACTAMENTE IGUAL
UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
