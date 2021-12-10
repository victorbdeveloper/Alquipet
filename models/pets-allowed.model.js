const { Schema, model } = require("mongoose");

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

PetsAllowedSchema.methods.toJSON = function () {
  const { __v, _id, ...pets_allowed } = this.toObject();
  pets_allowed.uid = _id;
  return pets_allowed;
};

module.exports = model("Pets_allowed", PetsAllowedSchema);
