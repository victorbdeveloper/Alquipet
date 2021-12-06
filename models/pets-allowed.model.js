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

PetsAllowedSchema.methods.toJSON = function () {
  const { __v, _id, ...pets_allowed } = this.toObject();
  pets_allowed.uid = _id;
  return pets_allowed;
};

module.exports = model("Pets_allowed", PetsAllowedSchema);
