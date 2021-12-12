//IMPORTS NODE
const { Schema, model } = require("mongoose");

//CREA UN MODELO PARA LAS MASCOTAS ADMITIDAS
const PetsAllowedSchema = Schema({
  dogs: {
    type: Boolean,
    default: false,
  },
  cats: {
    type: Boolean,
    default: false,
  },
  birds: {
    type: Boolean,
    default: false,
  },
  rodents: {
    type: Boolean,
    default: false,
  },
  exotic: {
    type: Boolean,
    default: false,
  },
  others: {
    type: String,
  },
});

//SOBRESCRIBE EL MÉTODO TOJSON PARA NO TENER EN CUENTA ALGUNOS DE LOS CAMPOS DE LA RESPUESTA DE LA BD
PetsAllowedSchema.methods.toJSON = function () {
  const { __v, _id, ...pets_allowed } = this.toObject();
  pets_allowed.uid = _id;
  return pets_allowed;
};

//EXPORTS
module.exports = model("Pets_allowed", PetsAllowedSchema);
