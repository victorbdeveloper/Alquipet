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
    .populate("created_by", {
      password: 0,
      google: 0,
      favorite_listings: 0,
      state: 0,
      __v: 0,
    })
    .populate("address", { __v: 0 })
    .populate("pets_allowed", { __v: 0 })
    .populate("photos", { __v: 0 });

  if (listing === null) {
    res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  return res.json({
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
      .populate("created_by", {
        password: 0,
        google: 0,
        favorite_listings: 0,
        state: 0,
        __v: 0,
      })
      .populate("address", { __v: 0 })
      .populate("pets_allowed", { __v: 0 })
      .populate("photos", { __v: 0 })
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
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  return res.json({
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
      .populate("created_by", {
        password: 0,
        google: 0,
        favorite_listings: 0,
        state: 0,
        __v: 0,
      })
      .populate("address", { __v: 0 })
      .populate("pets_allowed", { __v: 0 })
      .populate("photos", { __v: 0 })
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
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  return res.json({
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
    return res.status(500).json({
      msg: "Ha ocurrido un error en el servidor.",
    });
  }

  //PETS_ALLOWED
  const petsAllowed = new PetsAllowed(
    ({ dogs, cats, birds, rodents, exotic, others } = req.body)
  );

  console.log(req.files);

  //PHOTOS
  if (req.files !== null && req.files !== undefined) {
    try {
      photos = await uploadFiles(created_by, req.files.photos);

      for (const photo of photos) {
        idPhotos.push(photo._id);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
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
  return res.json({
    msg: "Anuncio creado con éxito",
    listing,
  });
};

const updateListing = async (req = request, res = response) => {
  const { id_listing, id_user } = req.query;

  //VALIDAR SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al verificar la pertenencia del anuncio al usuario",
      // user,
    });
  }

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
    return res.status(500).json({
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
    .populate("created_by", {
      password: 0,
      google: 0,
      favorite_listings: 0,
      state: 0,
      __v: 0,
    })
    .populate("address", { __v: 0 })
    .populate("pets_allowed", { __v: 0 })
    .populate("photos", { __v: 0 });

  if (listing === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  return res.json({
    msg: "Anuncio modificado con éxito.",
    listing,
  });
};

const deleteListing = async (req = request, res = response) => {
  const { id_listing, id_user } = req.query;

  //VALIDAR SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al verificar la pertenencia del anuncio al usuario",
    });
  }

  const listing = await Listing.findByIdAndUpdate(id_listing, {
    state: false,
  }).where({
    state: true,
  });

  if (listing === null) {
    return res.json({
      msg: "El anuncio que se intenta eliminar no existe. Ningún anuncio encontrado.",
    });
  }

  return res.json({
    msg: "Anuncio eliminado con éxito.",
    listing,
  });
};

const getFilteredUserFavoritesListingsPaginated = async (
  req = request,
  res = response
) => {
  const { id_user } = req.query;

  //SE OBTIENEN TODOS LOS ANUNCIOS FAVORITOS DEL USUARIO
  const [favoritedListings] = await User.find(
    { _id: id_user },
    { favorite_listings: 1, _id: 0 }
  );

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

  const queryListing = getQueryFilterListing(
    params,
    addresses,
    petsAllowed,
    favoritedListings.favorite_listings
  );

  const queryListingOrderBy = getQueryOrderByListing(order_by);

  const [totalListings, listings] = await Promise.all([
    Listing.countDocuments(queryListing).where({ state: true }),
    Listing.find(queryListing)
      .where({ state: true })
      .populate("created_by", {
        password: 0,
        google: 0,
        favorite_listings: 0,
        state: 0,
        __v: 0,
      })
      .populate("address", { __v: 0 })
      .populate("pets_allowed", { __v: 0 })
      .populate("photos", { __v: 0 })
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
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  return res.json({
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

const addListingToUserFavoritesListings = async (
  req = request,
  res = response
) => {
  const { id_listing, id_user } = req.query;

  //VERIFICAR SI UN ANUNCIO QUE QUIERE AÑADIRSE A FAVORITOS YA ESTA AÑADIDO A LOS FAVORITOS DEL USUARIO
  const validateListing = await User.find({
    $and: [{ id: id_user }, { favorite_listings: id_listing }],
  });

  if (validateListing.length > 0) {
    return res.json({
      msg: `El anuncio con id ${id_listing} ya esta añadido a la lista de favoritos del usuario`,
    });
  }

  const user = await User.findByIdAndUpdate(
    id_user,
    {
      $push: { favorite_listings: id_listing },
    },
    { new: true }
  )
    .select({
      password: 0,
      google: 0,
      state: 0,
      __v: 0,
    })
    .where({
      state: true,
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "created_by",
        model: "User",
        select: {
          password: 0,
          google: 0,
          favorite_listings: 0,
          state: 0,
          __v: 0,
        },
      },
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "address",
        model: "Address",
        select: { __v: 0 },
      },
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "pets_allowed",
        model: "Pets_allowed",
        select: { __v: 0 },
      },
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "photos",
        model: "Photo",
        select: { __v: 0 },
      },
    });

  if (user === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  return res.json({
    msg: "Anuncio añadido a favoritos con éxito.",
    user,
  });
};

const deleteListingToUserFavoritesListings = async (
  req = request,
  res = response
) => {
  const { id_listing, id_user } = req.query;

  //VERIFICAR SI EL ANUNCIO QUE QUIERE ELIMINARSE DE FAVORITOS ESTA AÑADIDO A LOS FAVORITOS DEL USUARIO
  const validateListing = await User.find({
    $and: [{ id: id_user }, { favorite_listings: id_listing }],
  });

  if (validateListing.length == 0) {
    return res.json({
      msg: `El anuncio con id ${id_listing} no esta añadido a la lista de favoritos del usuario`,
    });
  }

  const user = await User.findByIdAndUpdate(
    id_user,
    {
      $pull: { favorite_listings: id_listing },
    },
    { new: true }
  )
    .select({
      password: 0,
      google: 0,
      state: 0,
      __v: 0,
    })
    .where({
      state: true,
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "created_by",
        model: "User",
        select: {
          password: 0,
          google: 0,
          favorite_listings: 0,
          state: 0,
          __v: 0,
        },
      },
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "address",
        model: "Address",
        select: { __v: 0 },
      },
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "pets_allowed",
        model: "Pets_allowed",
        select: { __v: 0 },
      },
    })
    .populate({
      path: "favorite_listings",
      populate: {
        path: "photos",
        model: "Photo",
        select: { __v: 0 },
      },
    });

  if (user === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  return res.json({
    msg: "Anuncio eliminado de favoritos con éxito.",
    user,
  });
};

const addPhotosToListing = async (req = request, res = response) => {
  const { id_user, id_listing } = req.query;

  let photos;
  let idPhotos = [];

  //VALIDAR SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al comprobar la pertenencia al usuario del anuncio",
    });
  }

  //PHOTOS
  if (req.files !== null && req.files !== undefined) {
    try {
      photos = await uploadFiles(id_user, req.files.photos);

      for (const photo of photos) {
        idPhotos.push(photo._id);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Ha ocurrido un error en el servidor cuando se ha intentado subir las fotos a Cloudinary.",
      });
    }
  } else {
    return res.status(400).json({
      msg: "No se ha incluido ninguna imágen para añadirla al anuncio.",
    });
  }

  //AÑADIMOS LAS FOTOS A LA BD
  if (photos !== undefined) {
    for (const photo of photos) {
      await photo.save();
    }
  }

  //ACTUALIZAMOS EL LISTING
  const listing = await Listing.findByIdAndUpdate(
    id_listing,
    {
      $push: { photos: photos },
    },
    { new: true } //con new:true se muestran los resultados de los cambios ya producidos
  )
    .where({ state: true })
    .populate("created_by", {
      password: 0,
      google: 0,
      favorite_listings: 0,
      state: 0,
      __v: 0,
    })
    .populate("address", { __v: 0 })
    .populate("pets_allowed", { __v: 0 })
    .populate("photos", { __v: 0 });

  //RESPUESTA
  return res.json({
    msg: "Imágenes añadidas con éxito",
    listing,
  });
};

//TODO: FALTAN DE AÑADIR DELETE_PHOTO
const deletePhotosToListing = async (req = request, res = response) => {
  //VALIDAR SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al comprobar la pertenencia al usuario del anuncio",
    });
  }
  //COMPROBAR SI LAS PHOTOS PERTENECEN AL LISTING

  //RESPUESTA
  return res.json({
    msg: "Imágenes eliminadas con éxito",
    listing,
  });
};

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
