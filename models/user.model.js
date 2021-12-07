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
      id: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
      },
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
