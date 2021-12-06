const { Schema, model } = require("mongoose");

const AddressSchema = Schema({
  province: {
    type: String,
    required: [true, "La provincia es obligatoria"],
  },
  Municipality: {
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
    required: [true, "La latitud es obligatoria"],
  },
  longitude: {
    type: String,
    required: [true, "La longitud es obligatoria"],
  },
});

AddressSchema.methods.toJSON = function () {
  const { __v, _id, ...address } = this.toObject();
  address.uid = _id;
  return address;
};

module.exports = model("Address", AddressSchema);
