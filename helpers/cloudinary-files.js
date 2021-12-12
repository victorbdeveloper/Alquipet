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
  } else {
    photosArray.push(photos);
  }

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

async function deleteFiles(photos = []) {
  console.log(photos);

  try {
    for (const photo of photos) {
      const resp = await cloudinary.uploader.destroy(
        photo.public_id_cloudinary
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al eliminar fotos de cloudinary");
  }
}

module.exports = {
  uploadFiles,
  deleteFiles,
};
