//IMPORTS NODE
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "alquipet",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//IMPORTS PROYECTO
const Photo = require("../models/photo.model");

/*
 * Función que recibe un uid y las imágenes.
 * Sube las imágenes a Cloudinary y devuelve un array de objetos Photo con las imágenes subidas.
 */
async function uploadFiles(uid = "", photos = []) {
  let photosResponse = [];
  let photosArray = [];

  //SE COMPRUEBA SI SE HA PASADO MAS DE 1 IMÁGEN, SI NO, SE GUARDA EN UN ARRAY (si viene mas de 1 imágen ya viene como array)
  if (Array.isArray(photos)) {
    photosArray = photos;
  } else {
    photosArray.push(photos);
  }

  try {
    for (const photoIndex of photosArray) {
      //SUBE LA IMÁGEN A CLOUDINARY Y LA GUARDA EN LA CARPETA QUE TIENE DE NOMBRE EL UID PASADO POR PARÁMETROS
      const resp = await cloudinary.uploader.upload(photoIndex.tempFilePath, {
        folder: `Alquipet/${uid}`,
      });

      //CREA UN OBJETO DE TIPO PHOTO
      const photo = new Photo({
        file_name: photoIndex.name,
        public_id_cloudinary: resp.public_id,
        url_cloudinary: resp.secure_url,
      });

      //AÑADE EL OBJETO A UN ARRAY
      photosResponse.push(photo);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al subir fotos a cloudinary");
  }

  return photosResponse;
}

/*
 * Función que recibe las imágenes.
 * Elimina las imágenes de Cloudinary.
 */
async function deleteFiles(photos = []) {
  try {
    for (const photo of photos) {
      //BUSCA LAS IMÁGENES EN CLOUDINARY MEDIANTE EL VALOR DE "public_id_cloudinary" DE CADA IMÁGEN Y LAS ELIMINA
      await cloudinary.uploader.destroy(photo.public_id_cloudinary);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al eliminar fotos de cloudinary");
  }
}

//EXPORTS
module.exports = {
  uploadFiles,
  deleteFiles,
};
