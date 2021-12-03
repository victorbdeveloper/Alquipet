const { Schema, model } = require("mongoose");

const PhotoSchema = Schema({
  file_name: {
    type: String,
    required: [true, "El nombre del archivo es obligatorio"],
  },
  //TODO: REVISAR ESTE CAMPO, ES POSIBLE QUE HAYA QUE SACARLO DE UN ARRAY CON OPCIONES COMO EN LA CLASE ROLE DEL EJEMPLO
  file_name: {
    type: String,
    required: [true, "El tipo de archivo es obligatorio"],
  },
  length: {
    type: Number, //TODO: revisar si es la manera correcta de poner un campo tipo int
    required: [true, "Establecer el tamaño del archivo es obligatorio"],
  },
  compressed: {
    type: Boolean,
    required: [true, "Establecer si el archivo esta comprimido es obligatorio"],
    default: false,
  },
});

//TODO: CAMBIARA POR LOS DATOS DEL PHOTO
PhotoSchema.methods.toJSON = function () {
  // const { __v, _id, password, ...user } = this.toObject();
  // user.uid = _id;
  // return user;
};

module.exports = model("Photo", PhotoSchema);
