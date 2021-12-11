const { request, response } = require("express");

const {
  generateLatLong,
  uploadFiles,
  deleteFiles,
  getAddressListingFiltered,
  getPetsAllowedListingFiltered,
  getQueryFilterListing,
  getQueryOrderByListing,
} = require("../helpers/index.helper");

const Listing = require("../models/listing.model");
const Address = require("../models/address.model");
const PetsAllowed = require("../models/pets-allowed.model");
const User = require("../models/user.model");

const getListingById = async (req = request, res = response) => {
  const { id } = req.query;
  const listing = await Listing.findById(id)
    .where({ state: true })
    .populate({
      path: "created_by",
    })
    .populate({
      path: "address",
    })
    .populate({
      path: "pets_allowed",
    })
    .populate("photos");

  if (listing === null) {
    res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  res.json({
    msg: "Anuncio encontrado con éxito en la Base de Datos.",
    listing,
  });
};

const getFilteredMyListingsPaginated = async (
  req = request,
  res = response
) => {
  //FILTRADO DE DIRECCIÓN
  const { province = "" } = req.query;
  let addresses = [];

  if (province.toString().trim().length > 0) {
    [addresses] = await getAddressListingFiltered(province);
  }

  //FILTRADO DE MASCOTAS
  const pets = ({
    dogs = false,
    cats = false,
    birds = false,
    rodents = false,
    exotic = false,
    others = false,
  } = req.query);

  let petsAllowed = await getPetsAllowedListingFiltered(pets);

  //FILTRADO DE ANUNCIOS
  const params = ({
    id = "",
    price_min = 0,
    price_max = 9999999999,
    order_by = "",
    index_from = 0,
    index_limit = 10,
  } = req.query);

  const queryListing = getQueryFilterListing(params, addresses, petsAllowed);

  const queryListingOrderBy = getQueryOrderByListing(order_by);

  const [totalListings, listings] = await Promise.all([
    Listing.countDocuments(queryListing)
      .where({ created_by: id })
      .where({ state: true }),

    Listing.find(queryListing)
      .where({ created_by: id })
      .where({ state: true })
      //TODO: INTEGRAR EL POPULATE DE USER Y FAVORITES SI NO SE VE!
      .populate({
        path: "created_by",
      })
      .populate({
        path: "address",
        // match: { addres: { $in: addresses } }, //TODO: ELIMINAR AL ACABAR SI NO HA DADO PROBLEMAS!!!
      })
      .populate({
        path: "pets_allowed",
        // match: { pets_allowed: { $in: petsAllowed } }, //TODO: ELIMINAR AL ACABAR SI NO HA DADO PROBLEMAS!!!
      })
      .populate("photos")
      .sort(queryListingOrderBy)
      .skip(
        index_from < 1
          ? 0
          : index_from === undefined
          ? 0
          : Number(index_from) - 1
      )
      .limit(Number(index_limit)),
  ]);

  if (listings === null) {
    res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  res.json({
    "Total anuncios encontrados aplicando los filtros:":
      listings.length > 0 ? totalListings : 0,
    "Anuncios mostrados: ": listings.length > 0 ? listings.length : 0,
    "Índice del primer anuncio mostrado: ":
      index_from === undefined && listings.length > 0
        ? 1
        : index_from === undefined && listings.length == 0
        ? 0
        : index_from < 1 && listings.length > 0
        ? 1
        : index_from < 1 && listings.length == 0
        ? 0
        : listings.length > 0
        ? Number(index_from)
        : 0,
    "Índice del último anuncio mostrado: ":
      (index_from === undefined || index_from < 1) && listings.length > 0
        ? listings.length
        : (index_from === undefined || index_from < 1) && listings.length == 0
        ? 0
        : index_from > 0 && listings.length > 0
        ? Number(index_from) + listings.length - 1
        : 0,
    results: listings,
  });
};

const getFilteredListingPaginated = async (req = request, res = response) => {
  //FILTRADO DE DIRECCIÓN
  const { province = "" } = req.query;
  let addresses = [];

  if (province.toString().trim().length > 0) {
    [addresses] = await getAddressListingFiltered(province);
  }

  //FILTRADO DE MASCOTAS
  const pets = ({
    dogs = false,
    cats = false,
    birds = false,
    rodents = false,
    exotic = false,
    others = false,
  } = req.query);

  let petsAllowed = await getPetsAllowedListingFiltered(pets);

  //FILTRADO DE ANUNCIOS
  const params = ({
    price_min = 0,
    price_max = 9999999999,
    order_by = "",
    index_from,
    index_limit = 10,
  } = req.query);

  const queryListing = getQueryFilterListing(params, addresses, petsAllowed);

  const queryListingOrderBy = getQueryOrderByListing(order_by);

  const [totalListings, listings] = await Promise.all([
    Listing.countDocuments(queryListing).where({ state: true }),
    Listing.find(queryListing)
      .where({ state: true })
      .populate({
        path: "created_by",
      })
      .populate({
        path: "address",
        // match: { addres: { $in: addresses } }, //TODO: ELIMINAR AL ACABAR SI NO HA DADO PROBLEMAS!!!
      })
      .populate({
        path: "pets_allowed",
        // match: { pets_allowed: { $in: petsAllowed } }, //TODO: ELIMINAR AL ACABAR SI NO HA DADO PROBLEMAS!!!
      })
      .populate("photos")
      .sort(queryListingOrderBy)
      .skip(
        index_from < 1
          ? 0
          : index_from === undefined
          ? 0
          : Number(index_from) - 1
      )
      .limit(Number(index_limit)),
  ]);

  if (listings === null) {
    res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  res.json({
    "Total anuncios encontrados aplicando los filtros:":
      listings.length > 0 ? totalListings : 0,
    "Anuncios mostrados: ": listings.length > 0 ? listings.length : 0,
    "Índice del primer anuncio mostrado: ":
      index_from === undefined && listings.length > 0
        ? 1
        : index_from === undefined && listings.length == 0
        ? 0
        : index_from < 1 && listings.length > 0
        ? 1
        : index_from < 1 && listings.length == 0
        ? 0
        : listings.length > 0
        ? Number(index_from)
        : 0,
    "Índice del último anuncio mostrado: ":
      (index_from === undefined || index_from < 1) && listings.length > 0
        ? listings.length
        : (index_from === undefined || index_from < 1) && listings.length == 0
        ? 0
        : index_from > 0 && listings.length > 0
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
  const { id_listing } = req.query;

  //CREAR OBJETO ADDRESS CON LOS NUEVOS VALORES Y CAMBIAR TABLA ADDRESSES
  const { province, municipality, postal_code, street, number, flour, letter } =
    req.body;
  const address = {
    province,
    municipality,
    postal_code,
    street,
    number,
    flour,
    letter,
    latitude: "",
    longitude: "",
  };

  //SE VUELVEN A GENERAR LAS COORDENADAS PARA LA NUEVA DIRECCIÓN
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

  await Address.findByIdAndUpdate(validateListing[0].address._id, address, {
    new: true,
  });

  //CREAR OBJETO PETS_ALLOWED CON LOS NUEVOS VALORES Y CAMBIAR TABLA PETS_ALLOWED
  const { dogs, cats, birds, rodents, exotic, others } = req.body;
  const pets = {
    dogs,
    cats,
    birds,
    rodents,
    exotic,
    others,
  };
  await PetsAllowed.findByIdAndUpdate(
    validateListing[0].pets_allowed._id,
    pets,
    { new: true }
  );

  //MODIFICAR LOS VALORES DEL LISTING CON LOS OBJETOS CREADOS ANTERIORMENTE Y LOS DATOS QUE LLEGAN EN EL BODY
  const { price, description } = req.body;

  const listing = await Listing.findByIdAndUpdate(
    id_listing,
    { price: price, description: description },
    { new: true } //con new:true se muestran los resultados de los cambios ya producidos
  )
    .where({ state: true })
    .populate({
      path: "created_by",
    })
    .populate({
      path: "address",
    })
    .populate({
      path: "pets_allowed",
    })
    .populate("photos");

  if (listing === null) {
    res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  res.json({
    msg: "Anuncio modificado con éxito.",
    listing,
  });
};

const deleteListing = async (req = request, res = response) => {
  const { id_listing } = req.query;

  const listing = await Listing.findByIdAndUpdate(id_listing, {
    state: false,
  }).where({
    state: true,
  });

  if (listing === null) {
    res.json({
      msg: "El anuncio que se intenta eliminar no existe. Ningún anuncio encontrado.",
    });
  }

  res.json({
    msg: "Anuncio modificado con éxito.",
  });
};

//TODO: FALTAN DE AÑADIR ADD_PHOTO, DELETE_PHOTO, ADD_FAVORITE, DELETE_FAVORITE
const getFilteredUserFavoritesListingsPaginated = async (
  req = request,
  res = response
) => {};

const addListingToUserFavoritesListings = async (
  req = request,
  res = response
) => {
  const { id_listing, id_user } = req.query;

  const user = await User.findByIdAndUpdate(
    id_user,
    {
      $push: { favorite_listings: id_listing },
    },
    { new: true }
  ).where({
    state: true,
  });

  if (user === null) {
    res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  res.json({
    msg: "Anuncio modificado con éxito.",
    user,
  });
};

const deleteListingToUserFavoritesListings = async (
  req = request,
  res = response
) => {};
const addPhotosToListing = async (req = request, res = response) => {};
const deletePhotosToListing = async (req = request, res = response) => {};

//TODO: DOCUMENTAR TODO EL CÓDIGO, QUITAR TODOS LOS LOGS Y ARREGLAR LOS WARNINGS!

module.exports = {
  getListingById,
  getFilteredMyListingsPaginated,
  getFilteredListingPaginated,
  createListing,
  updateListing,
  deleteListing,
  getFilteredUserFavoritesListingsPaginated,
  addListingToUserFavoritesListings,
  deleteListingToUserFavoritesListings,
  addPhotosToListing,
  deletePhotosToListing,
};
