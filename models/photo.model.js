//IMPORTS NODE
const { Schema, model } = require("mongoose");

//CREA UN MODELO PARA LAS FOTOS
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


//SOBRESCRIBE EL MÉTODO TOJSON PARA NO TENER EN CUENTA ALGUNOS DE LOS CAMPOS DE LA RESPUESTA DE LA BD
PhotoSchema.methods.toJSON = function () {
  const { __v, _id, ...photo } = this.toObject();
  photo.uid = _id;
  return photo;
};

//EXPORTS
module.exports = model("Photo", PhotoSchema);
