const { request, response } = require("express");

const {
  generateLatLong,
  uploadFiles,
  deleteFiles,
} = require("../helpers/index.helper");

const Listing = require("../models/listing.model");
const Address = require("../models/address.model");
const PetsAllowed = require("../models/pets-allowed.model");

const getListingById = async (req = request, res = response) => {
  const { id } = req.query;
  const listing = await Listing.findById(id)
    .populate({
      path: "address",
    })
    .populate({
      path: "pets_allowed",
    })
    .populate("photos");
  res.json({
    msg: "Anuncio encontrado con éxito en la Base de Datos.",
    listing,
  });
};

const getFilteredListingPaginated = async (req = request, res = response) => {
  //FILTRADO DE DIRECCIÓN
  const { province = "" } = req.query;
  let addresses = [];
  const regex = new RegExp(province, "i"); //expresión regular para no tener en cuenta las mayus y minus

  if (province.toString().trim().length > 0) {
    [addresses] = await Promise.all([
      Address.find(
        {
          province: regex,
        },
        { _id: 1 }
      ),
    ]);
  }

  //FILTRADO DE MASCOTAS
  const {
    dogs = false,
    cats = false,
    birds = false,
    rodents = false,
    exotic = false,
    others = false,
  } = req.query;

  let petsAllowed = [];

  let queryPets = {
    dogs: dogs,
    cats: cats,
    birds: birds,
    rodents: rodents,
    exotic: exotic,
    others: others != false ? { $exists: true } : false,
  };

  if (dogs === false) delete queryPets.dogs;
  if (cats === false) delete queryPets.cats;
  if (birds === false) delete queryPets.birds;
  if (rodents === false) delete queryPets.rodents;
  if (exotic === false) delete queryPets.exotic;
  if (others === false) delete queryPets.others;

  if (Object.entries(queryPets).length > 0) {
    [petsAllowed] = await Promise.all([
      PetsAllowed.find(queryPets, { _id: 1 }),
    ]);
  }

  //FILTRADO DE ANUNCIOS
  const {
    price_min = 0,
    price_max = 9999999999,
    order_by = "",
    index_from = 0,
    index_limit = 10,
  } = req.query;

  const queryListing = {
    $and: [
      { price: { $gt: parseInt(price_min) - 1 } },
      { price: { $lte: parseInt(price_max) } },
    ],
    state: true,
    address: { $in: addresses },
    pets_allowed: { $in: petsAllowed },
  };

  if (addresses.length === 0) delete queryListing.address;
  if (petsAllowed.length === 0) delete queryListing.pets_allowed;

  const queryListingOrderBy = {
    date_publication: -1,
    price: 0,
  };

  switch (order_by) {
    case "price_max":
      queryListingOrderBy.price = -1;
      delete queryListingOrderBy.date_publication;
      break;
    case "price_min":
      queryListingOrderBy.price = 1;
      delete queryListingOrderBy.date_publication;
      break;
    case "date_newest":
      queryListingOrderBy.date_publication = -1;
      delete queryListingOrderBy.price;
      break;
    case "date_oldest":
      queryListingOrderBy.date_publication = 11;
      delete queryListingOrderBy.price;
      break;
    default:
      res.status(500).json({
        msg: "Error en el servidor --> (orderBy)",
      });
      break;
  }

  const [totalListings, listings] = await Promise.all([
    Listing.countDocuments(queryListing),
    Listing.find(queryListing)
      .populate({
        path: "address",
        match: { addres: { $in: addresses } },
      })
      .populate({
        path: "pets_allowed",
        match: { pets_allowed: { $in: petsAllowed } },
      })
      .populate("photos")
      .sort(queryListingOrderBy)
      .skip(index_from == 0 ? 0 : Number(index_from) - 1)
      .limit(Number(index_limit)),
  ]);

  res.json({
    "Total anuncios encontrados aplicando los filtros:":
      listings.length > 0 ? totalListings : 0,
    "Anuncios mostrados: ": listings.length > 0 ? listings.length : 0,
    "Índice primer anuncio mostrado: ":
      index_from == 0 ? 1 : listings.length > 0 ? Number(index_from) : 0,
    "Índice último anuncio mostrado: ":
      index_from == 0
        ? listings.length
        : listings.length > 0
        ? Number(index_from) + listings.length - 1
        : 0,
    results: listings,
  });
};

const createListing = async (req = request, res = response) => {
  const { created_by } = req.body;
  let photos;
  let idPhotos = [];

  //ADDRESS
  const address = new Address(
    ({ province, municipality, postal_code, street, number, flour, letter } =
      req.body)
  );

  // se obtienen la latitud y la longitud en base a la dirección pasada en la request utilizando el servicio de MapBox
  try {
    const latLong = await generateLatLong(address);

    if (latLong != undefined) {
      address.latitude = latLong[0].lat;
      address.longitude = latLong[0].long;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ha ocurrido un error en el servidor.",
    });
  }

  //PETS_ALLOWED
  const petsAllowed = new PetsAllowed(
    ({ dogs, cats, birds, rodents, exotic, others } = req.body)
  );

  //PHOTOS
  if (req.files !== null) {
    try {
      photos = await uploadFiles(created_by, req.files.photos);

      for (const photo of photos) {
        idPhotos.push(photo._id);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Ha ocurrido un error en el servidor cuando se ha intentado subir las fotos a Cloudinary.",
      });
    }
  }

  //LISTING
  const listing = new Listing({
    created_by: created_by,
    address: address._id,
    pets_allowed: petsAllowed._id,
    photos: idPhotos,
    price: req.body.price,
    description: req.body.description,
  });

  //SAVE OBJECTS IN DB
  await listing.save();
  await address.save();
  await petsAllowed.save();

  if (photos !== undefined) {
    for (const photo of photos) {
      await photo.save();
    }
  }

  //RESPUESTA
  res.json({
    msg: "Anuncio creado con éxito",
    listing,
  });
};

const updateListing = async (req = request, res = response) => {
  //   const { id } = req.query;
  //   const { password, phone, ...rest } = req.body;
  //   //comprueba si se le ha pasado el password o no
  //   if (password) {
  //     //encriptar la contraseña
  //     const salt = bcryptjs.genSaltSync();
  //     rest.password = bcryptjs.hashSync(password, salt);
  //   }
  //   //comprueba si se le ha pasado el phone o no
  //   if (phone) {
  //     rest.phone = phone;
  //   }
  //   //comprueba si no se le ha pasado ningún dato a la petición
  //   if (!password || !phone) {
  //     res.json({
  //       msg: "No se ha facilitado ningún dato.",
  //     });
  //   }
  //   const user = await User.findByIdAndUpdate(
  //     id,
  //     { password: rest.password, phone: rest.phone },
  //     { new: true } //con new:true se muestran los resultados de los cambios ya producidos
  //   );
  //   res.json({
  //     msg: "Usuario modificado con éxito.",
  //     user,
  //   });
};

const deleteListing = async (req = request, res = response) => {
  //   const { id } = req.query;
  //   //BORRADO FISICO DE LA BD
  //   // const user = await User.findByIdAndDelete(id);
  //   //BORRADO CAMBIANDO EL STATE DEL USUARIO PARA QUE PERMANEZCA EN LA BD Y NO SE PIERDA LA INTEGRIDAD REFERENCIAL
  //   const user = await User.findByIdAndUpdate(
  //     id,
  //     { state: false },
  //     { new: true } //mediante new:true se muestran los resultados de los cambios ya producidos.
  //   );
  //   res.json({
  //     msg: "Usuario eliminado con éxito.",
  //     user,
  //   });
};

//TODO: FALTAN DE AÑADIR ADD_PHOTO, DELETE_PHOTO, ADD_FAVORITE, DELETE_FAVORITE

module.exports = {
  createListing,
  getListingById,
  getFilteredListingPaginated,
  updateListing,
  deleteListing,
};
