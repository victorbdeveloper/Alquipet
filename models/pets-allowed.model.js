const { Schema, model } = require("mongoose");

const PetsAllowedSchema = Schema({
  dogs: {
    type: Boolean,
    required: [true, "Establecer si se admiten perros es obligatorio"],
    default: false,
  },
  cats: {
    type: Boolean,
    required: [true, "Establecer si se admiten gatos es obligatorio"],
    default: false,
  },
  birds: {
    type: Boolean,
    required: [true, "Establecer si se admiten pájaros es obligatorio"],
    default: false,
  },
  rodents: {
    type: Boolean,
    required: [true, "Establecer si se admiten roedores es obligatorio"],
    default: false,
  },
  exotic: {
    type: Boolean,
    required: [
      true,
      "Establecer si se admiten mascotas exóticas es obligatorio",
    ],
    default: false,
  },
  others: {
    type: String,
  },
});

//TODO: CAMBIARA POR LOS DATOS DEL PETS_ALLOWED
PetsAllowedSchema.methods.toJSON = function () {
  // const { __v, _id, password, ...user } = this.toObject();
  // user.uid = _id;
  // return user;
};

module.exports = model("Pets_allowed", PetsAllowedSchema);
