const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "alquipet",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Photo = require("../models/photo.model");

async function uploadFiles(uid = "", photos = []) {
  let photosResponse = [];
  let photosArray = [];

  if (Array.isArray(photos)) {
    photosArray = photos;
  }else{
    photosArray.push(photos);
  }

  // console.log("AAAAAAAAAAA");
  // console.log(photosArray);

  try {
    for (const photoIndex of photosArray) {
      const resp = await cloudinary.uploader.upload(photoIndex.tempFilePath, {
        folder: `Alquipet/${uid}`,
      });

      const photo = new Photo({
        file_name: photoIndex.name,
        public_id_cloudinary: resp.public_id,
        url_cloudinary: resp.secure_url,
      });

      photosResponse.push(photo);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al subir fotos a cloudinary");
  }

  return photosResponse;
}


//TODO:!!!!!!!!!!
async function deleteFiles(uid = "", photos = []) {
  //BUSCAMOS EN LA BD TODAS LAS FOTOS QUE PERTENEZCAN AL USUARIO CON ID = uid Y QUE TENGAN DE ID = LOS IDS DEL ARRAY photos
  // ##si se pudieran conseguir los url_cloudinary al mismo tiempo que se borran las fotos de la bd sería genial!!
  //GUARDAMOS EN UN ARRAY EL url_cloudinary DE CADA FOTO
  //RECORREMOS EL ARRAY LLAMANDO A CLOUDINARY EN CADA ITERACIÓN DEL ARRAY Y BORRANDO LA FOTO DE CLOUDINARY

  try {
    const resp = await cloudinary.uploader.destroy(
      `Alquipet/61ac01f8ccec88e05fe6be23/elaek1dow52mjmyf09fb`
    );
    console.log(resp);
  } catch (error) {
    console.log(error);
    throw new Error("Error al eliminar fotos de cloudinary");
  }

  // cloudinary.api.delete_folder("product", function(error, result){console.log(result);}); FUNCIONAAAAAAA
  // cloudinary.api.delete_folder("RestServer NodeJs", function(error, result){console.log(result);}); FUNCIONAAA
  // cloudinary.api.create_folder("Alquipet/test", function (error, result) {
  //   console.log(result);
  // });
  // cloudinary.api.delete_folder("/Alquipet", function(error, result){console.log(result);});
  // const resp = await cloudinary.api.create_folder(
  //   "prueba",
  //   function (error, result) {
  //     console.log("AAA" + JSON.stringify(error));
  //     console.log("VVV" + JSON.stringify(result));
  //   }
  // );
  // console.log(resp);
}

module.exports = {
  uploadFiles,
  deleteFiles,
};
