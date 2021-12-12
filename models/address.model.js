//IMPORTS NODE
const { Schema, model } = require("mongoose");

//CREA UN MODELO PARA LA DIRECCIÓN
const AddressSchema = Schema({
  province: {
    type: String,
    required: [true, "La provincia es obligatoria"],
  },
  municipality: {
    type: String,
    required: [true, "El municipio es obligatorio"],
  },
  postal_code: {
    type: String,
    required: [true, "El código postal es obligatorio"],
  },
  street: {
    type: String,
    required: [true, "La calle es obligatoria"],
  },
  number: {
    type: String,
    required: [true, "El número es obligatorio"],
  },
  flour: {
    type: String,
    required: [true, "El piso es obligatorio"],
  },
  letter: {
    type: String,
    required: [true, "La letra es obligatoria"],
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
});

//SOBRESCRIBE EL MÉTODO TOJSON PARA NO TENER EN CUENTA ALGUNOS DE LOS CAMPOS DE LA RESPUESTA DE LA BD
AddressSchema.methods.toJSON = function () {
  const { __v, _id, ...address } = this.toObject();
  address.uid = _id;
  return address;
};

//EXPORTS
module.exports = model("Address", AddressSchema);
