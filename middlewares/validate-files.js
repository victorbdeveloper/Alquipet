//IMPORTS NODE
const { request, response } = require("express");

/*
 * Función anónima que recibe una request y una response.
 * Valida los archivos enviados en la petición.
 */
const validateFiles = (req = request, res = response, next) => {

  //SI NO SE HAN PASADO FOTOS SE SALE DIRECTAMENTE PORQUE NO HAY NADA QUE VALIDAR
  if (!req.files || Object.keys(req.files).length === 0) {
    return next();
  }

  //SI SE HAN PASADO MAS DE 15 FOTOS DEVUELVE ERROR
  if (Object.values(req.files.photos) > 15) {
    return res.status(400).json({
      msg: "Solo se admiten un máximo de 15 fotos.",
    });
  }

  //SI SOLO HAY 1 FOTO NO SE PUEDE RECORRER EN EL BUCLE PORQUE NO ES UN ARRAY, ASI QUE SE COMPRUEBA POR SEPARADO
  if (Array.isArray(req.files.photos)) {
    for (const photo of req.files.photos) {
      validations(photo);
    }
  } else {
    validations(req.files.photos);
  }

  //FUNCION PARA VALIDAR UNA FOTO
  function validations(photo) {
    //COMPRUEBA EL MIMETYPE DE LA FOTO Y SI NO COINCIDE CON NINGUNO ACEPTADO DEVUELVE ERROR
    if (
      photo.mimetype !== "image/jpg" &&
      photo.mimetype !== "image/jpeg" &&
      photo.mimetype !== "image/png" &&
      photo.mimetype !== "image/gif" &&
      photo.mimetype !== "image/svg+xml"
    ) {
      return res.status(400).json({
        msg: `La foto ${photo.name} no tiene el formato correcto. Formatos admitidos [.jpg / .jpeg / .png / .gif / .svg]`,
      });
    }

    //COMPRUEBA EL TAMAÑO DE LA FOTO, SI ES SUPERIOR A 5MB DEVUELVE ERROR
    if (photo.size > 5242880) {
      return res.status(400).json({
        msg: `La foto ${photo.name} ocupa mas de 5MB. `,
      });
    }
  }

  next();
};

//EXPORTS
module.exports = {
  validateFiles,
};
