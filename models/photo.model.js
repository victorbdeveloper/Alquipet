const { Schema, model } = require("mongoose");

const PhotoSchema = Schema({
  file_name: {
    type: String,
    required: [true, "El nombre del archivo es obligatorio"],
  },
  mime_type: {
    type: String,
    required: [true, "El tipo de archivo es obligatorio"],
    emun: ["gif", "jpeg", "png", "svg+xml"],
  },
  length: {
    type: Number,
    required: [true, "Establecer el tamaño del archivo es obligatorio"],
  },
  compressed: {
    type: Boolean,
    required: [true, "Establecer si el archivo esta comprimido es obligatorio"],
    default: false,
  },
});

PhotoSchema.methods.toJSON = function () {
  const { __v, _id, ...photo } = this.toObject();
  photo.uid = _id;
  return photo;
};

module.exports = model("Photo", PhotoSchema);
