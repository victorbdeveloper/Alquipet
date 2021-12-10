const { request, response } = require("express");

const validateFiles = (req = request, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next();
  }

  if (Object.keys(req.files).length > 15) {
    return res.status(400).json({
      msg: "Solo se admiten un máximo de 15 fotos.",
    });
  }

  for (const photo of req.files.photos) {
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
    //5MB
    if (photo.size > 5242880) {
      return res.status(400).json({
        msg: `La foto ${photo.name} ocupa mas de 5MB. `,
      });
    }
  }

  next();
};

module.exports = {
  validateFiles,
};
