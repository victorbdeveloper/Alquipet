//IMPORTS NODE
const { Schema, model } = require("mongoose");

//CREA UN MODELO PARA EL USUARIO
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
  },
  google: {
    type: Boolean,
    default: false,
  },
  state: {
    type: Boolean,
    default: true,
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "Photo",
  },
  favorite_listings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

//SOBRESCRIBE EL MÉTODO TOJSON PARA NO TENER EN CUENTA ALGUNOS DE LOS CAMPOS DE LA RESPUESTA DE LA BD
UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

//EXPORTS
module.exports = model("User", UserSchema);
