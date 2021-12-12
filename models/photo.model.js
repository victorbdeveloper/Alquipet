const { Schema, model } = require("mongoose");

const PhotoSchema = Schema({
  file_name: {
    type: String,
    required: [true, "El nombre del archivo es obligatorio"],
  },
  public_id_cloudinary: {
    type: String,
    required: [true, "El publicId del archivo en Cloudinary es obligatorio"],
  },
  url_cloudinary: {
    type: String,
    required: [
      true,
      "La url de cloudinary donde esta guardada la imágen es obligatorio",
    ],
  },
});

PhotoSchema.methods.toJSON = function () {
  const { __v, _id, ...photo } = this.toObject();
  photo.uid = _id;
  return photo;
};

module.exports = model("Photo", PhotoSchema);
