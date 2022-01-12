//IMPORTS NODE
const { request, response } = require("express");

//IMPORTS PROYECTO
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
const Photo = require("../models/photo.model");

/*
 * Función anónima que recibe la request y la response.
 * Obtiene un anuncio de la BD mediante el Id del anuncio y lo devuelve en la response.
 */
const getListingById = async (req = request, res = response) => {
  const { id } = req.query;

  //BUSCA EL ANUNCIO POR ID EN LA BD Y DEVUELVE EL RESULTDO
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

  // SI NO SE HA ENCONTRADO EL ANUNCIO EN LA BD
  if (listing === null) {
    res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  //RESPUETA
  return res.json({
    msg: "Anuncio encontrado con éxito en la Base de Datos.",
    listing,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Obtiene los anuncios de la BD, que pertenecen al usuario que se pasa por id, aplicando los filtros pasados en la petición.
 */
const getFilteredMyListingsPaginated = async (
  req = request,
  res = response
) => {
  //*FILTRADO DE DIRECCIÓN
  const { province = "" } = req.query;
  let addresses = [];

  //COMPRUEBA SI SE HA MANDADO UNA DIRECCIÓN EN LA PETICIÓN, SI SI QUE SE HA MANDADO, LLAMA A LA FUNCIÓN DE LOS HELPERS
  //QUE SE ENCARGA DE DEVOLVER EL FILTRO DE LA DIRECCIÓN
  if (province.toString().trim().length > 0) {
    [addresses] = await getAddressListingFiltered(province);
  }

  //*FILTRADO DE MASCOTAS
  //todas las mascotas que no se hayan pasado en la petición se establecen con el valor false por defecto para poder "simular"
  //el valor en caso de que no se haya marcado esta opción en el filtro.
  const pets = ({
    dogs = false,
    cats = false,
    birds = false,
    rodents = false,
    exotic = false,
    others = false,
  } = req.query);

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE DEVOLVER EL FILTRO DE LAS MASCOTAS PERMITIDAS
  let petsAllowed = await getPetsAllowedListingFiltered(pets);

  //*FILTRADO DE ANUNCIOS
  const params = ({
    id = "",
    price_min = 0,
    price_max = 9999999999,
    order_by = "",
    index_from = 0,
    index_limit = 10,
  } = req.query);

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE OBTENER TODOS LOS FILTROS APLICADOS Y CALCULADOS ANTERIORMENTE
  const queryListing = getQueryFilterListing(params, addresses, petsAllowed);

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE OBTENER EL ORDEN ESTABLECIDO PARA MOSTRAR LAS RESPUESTAS
  const queryListingOrderBy = getQueryOrderByListing(order_by);

  //PROMESA QUE HACE 2 CONSULTAS A LA BD, LA PRIMERA OBTIENE EL TOTAL DE RESULTADOS OBTENIDOS APLICANDO LOS FILTROS, LA SEGUNDA
  //OBTIENE LOS RESULTADOS OBTENIDOS APLICANDO LOS FILTROS
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

  //SI NO HAY RESULTADOS
  if (listings === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  //RESPUESTA
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

/*
 * Función anónima que recibe la request y la response.
 * Obtiene los anuncios de la BD, aplicando los filtros pasados en la petición.
 */
const getFilteredListingPaginated = async (req = request, res = response) => {
  //*FILTRADO DE DIRECCIÓN
  const { province = "" } = req.query;
  let addresses = [];

  //COMPRUEBA SI SE HA MANDADO UNA DIRECCIÓN EN LA PETICIÓN, SI SI QUE SE HA MANDADO, LLAMA A LA FUNCIÓN DE LOS HELPERS
  //QUE SE ENCARGA DE DEVOLVER EL FILTRO DE LA DIRECCIÓN
  if (province.toString().trim().length > 0) {
    [addresses] = await getAddressListingFiltered(province);
  }

  //*FILTRADO DE MASCOTAS
  //todas las mascotas que no se hayan pasado en la petición se establecen con el valor false por defecto para poder "simular"
  //el valor en caso de que no se haya marcado esta opción en el filtro.
  const pets = ({
    dogs = false,
    cats = false,
    birds = false,
    rodents = false,
    exotic = false,
    others = false,
  } = req.query);

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE DEVOLVER EL FILTRO DE LAS MASCOTAS PERMITIDAS
  let petsAllowed = await getPetsAllowedListingFiltered(pets);

  //*FILTRADO DE ANUNCIOS
  const params = ({
    price_min = 0,
    price_max = 9999999999,
    order_by = "",
    index_from,
    index_limit = Number(10),
  } = req.query);

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE OBTENER TODOS LOS FILTROS APLICADOS Y CALCULADOS ANTERIORMENTE
  const queryListing = getQueryFilterListing(params, addresses, petsAllowed);

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE OBTENER EL ORDEN ESTABLECIDO PARA MOSTRAR LAS RESPUESTAS
  const queryListingOrderBy = getQueryOrderByListing(order_by);

  //PROMESA QUE HACE 2 CONSULTAS A LA BD, LA PRIMERA OBTIENE EL TOTAL DE RESULTADOS OBTENIDOS APLICANDO LOS FILTROS, LA SEGUNDA
  //OBTIENE LOS RESULTADOS OBTENIDOS APLICANDO LOS FILTROS
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
        index_from < 1 ? 0
          : index_from === undefined ? 0
          : Number(index_from) - 1
      )
      .limit(Number(index_limit)),
  ]);

  //SI NO HAY RESULTADOS
  if (listings === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  //RESPUESTA
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

/*
 * Función anónima que recibe la request y la response.
 * Crea un anuncio perteneciente a un usuario en la BD y lo devuelve en la response.
 */
const createListing = async (req = request, res = response) => {
  const { created_by } = req.body;
  let photos;
  let idPhotos = [];

  //*ADDRESS
  //SE CREA UN OBJETO CON LA DIRECCIÓN
  const address = new Address(
    ({ province, municipality, postal_code, street, number, flour, letter } =
      req.body)
  );

  //OBTENER LATITUD Y LONGITUD DE LA DIRECCIÓN
  //se obtienen la latitud y la longitud en base a la dirección pasada en la request utilizando el servicio de MapBox
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

  //*PETS_ALLOWED
  //SE CREA UN OBJETO CON LAS MASCOTAS ADMITIDAS
  const petsAllowed = new PetsAllowed(
    ({ dogs, cats, birds, rodents, exotic, others } = req.body)
  );

  //*PHOTOS
  //SE COMPRUEBA SI SE HA MANDADO ALGUNA IMAGEN PARA ADJUNTARLA A LA ANUNCIO
  if (req.files !== null && req.files !== undefined) {
    try {
      //LLAMA A LA FUNCIÓN DE LOS HELPERS ENCARGADA DE SUBIR LAS IMÁGENES A CLOUDINARY
      photos = await uploadFiles(created_by, req.files.photos);

      //GUARDA EN UN ARRAY TODAS LAS FOTOS YA CREADAS QUE SE HAN RECIBIDO DESDE LA FUNCIÓN ANTERIOR
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

  //*LISTING
  //CREA UN NUEVO ANUNCIO CON TODOS LOS OBJETOS CREADOS ANTERIORMENTE
  const listingCreated = new Listing({
    created_by: created_by,
    address: address._id,
    pets_allowed: petsAllowed._id,
    photos: idPhotos,
    price: req.body.price,
    description: req.body.description,
  });

  //GUARDA LOS OBJETOS CREADOS EN SUS RESPECTIVAS COLECCIONES DE LA BD
  await address.save();
  await petsAllowed.save();

  if (photos !== undefined) {
    for (const photo of photos) {
      await photo.save();
    }
  }

  const listingCreatedResult = await listingCreated.save();

  //BUSCA EL ANUNCIO POR ID EN LA BD Y DEVUELVE EL RESULTDO
  const listing = await Listing.findById(listingCreatedResult._id)
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

  // SI NO SE HA ENCONTRADO EL ANUNCIO EN LA BD
  if (listing === null) {
    res.json({
      msg: "Error, no se ha creado el anuncio.",
    });
  }

  //RESPUESTA
  return res.json({
    msg: "Anuncio creado con éxito",
    listing,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Modifica un anuncio de la BD mediante el Id del anuncio y lo devuelve en la response.
 */
const updateListing = async (req = request, res = response) => {
  const { id_listing, id_user } = req.query;

  //VALIDA SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  //SI EL ANUNCIO NO PERTENECE AL USUARIO
  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al verificar la pertenencia del anuncio al usuario",
      // user,
    });
  }

  //* ADDRESS
  const { province, municipality, postal_code, street, number, flour, letter } =
    req.body;

  //CREA UN OBJETO ADDRESS CON LOS NUEVOS VALORES
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
  //se obtienen la latitud y la longitud en base a la dirección pasada en la request utilizando el servicio de MapBox
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

  //MODIFICA LA ENTRADA DE LA COLECCIÓN DE LA BD QUE TIENE LA DIRECCIÓN CON LOS NUEVOS DATOS
  await Address.findByIdAndUpdate(validateListing[0].address._id, address, {
    new: true,
  });

  //* PETS_ALLOWED
  const { dogs, cats, birds, rodents, exotic, others } = req.body;

  //CREA UN OBJETO PETS_ALLOWED CON LOS NUEVOS VALORES
  const pets = {
    dogs,
    cats,
    birds,
    rodents,
    exotic,
    others,
  };

  //MODIFICA LA ENTRADA DE LA COLECCIÓN DE LA BD QUE TIENE LAS MASCOTAS ADMITIDAS CON LOS NUEVOS DATOS
  await PetsAllowed.findByIdAndUpdate(
    validateListing[0].pets_allowed._id,
    pets,
    { new: true }
  );

  //*LISTING
  const { price, description } = req.body;

  //MODIFICA LA ENTRADA DE LA COLECCIÓN DE LA BD QUE TIENE EL ANUNCIP CON LOS NUEVOS DATOS
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

  //SI EL ANUNCIO NO SE HA MODIFICADO
  if (listing === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  //RESPUESTA
  return res.json({
    msg: "Anuncio modificado con éxito.",
    listing,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Elimina un anuncio de la BD mediante el Id del anuncio y lo devuelve en la response.
 */
const deleteListing = async (req = request, res = response) => {
  const { id_listing, id_user } = req.query;

  //VALIDA SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  //SI EL ANUNCIO NO PERTENECE AL USUARIO
  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al verificar la pertenencia del anuncio al usuario",
    });
  }

  //ELIMINA EL ANUNCIO BUSCANDOLO POR EL ID DEL USUARIO
  const listing = await Listing.findByIdAndUpdate(id_listing, {
    state: false,
  })
    .where({
      state: true,
    })
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

  //SI EL ANUNCIO NO SE ENCUENTRA EN LA BD
  if (listing === null) {
    return res.json({
      msg: "El anuncio que se intenta eliminar no existe. Ningún anuncio encontrado.",
    });
  }

  //RESPUESTA
  return res.json({
    msg: "Anuncio eliminado con éxito.",
    listing,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Obtiene los anuncios favoritos de un usuario de la BD, aplicando los filtros pasados en la petición.
 */
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

  //SI EL USUARIO NO TIENE ANUNCIOS FAVORITOS
  if (favoritedListings.length == 0) {
    return res.json({
      msg: "El usuario no tiene ningún anuncio añadido a favoritos. Ningún anuncio encontrado.",
    });
  }

  //*FILTRADO DE DIRECCIÓN
  const { province = "" } = req.query;
  let addresses = [];

  //COMPRUEBA SI SE HA MANDADO UNA DIRECCIÓN EN LA PETICIÓN, SI SI QUE SE HA MANDADO, LLAMA A LA FUNCIÓN DE LOS HELPERS
  //QUE SE ENCARGA DE DEVOLVER EL FILTRO DE LA DIRECCIÓN
  if (province.toString().trim().length > 0) {
    [addresses] = await getAddressListingFiltered(province);
  }

  //*FILTRADO DE MASCOTAS
  //todas las mascotas que no se hayan pasado en la petición se establecen con el valor false por defecto para poder "simular"
  //el valor en caso de que no se haya marcado esta opción en el filtro.
  const pets = ({
    dogs = false,
    cats = false,
    birds = false,
    rodents = false,
    exotic = false,
    others = false,
  } = req.query);

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE DEVOLVER EL FILTRO DE LAS MASCOTAS PERMITIDAS
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

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE OBTENER TODOS LOS FILTROS APLICADOS Y CALCULADOS ANTERIORMENTE
  const queryListing = getQueryFilterListing(
    params,
    addresses,
    petsAllowed,
    favoritedListings.favorite_listings
  );

  //LLAMA A LA FUNCIÓN DE LOS HELPERS QUE SE ENCARGA DE OBTENER EL ORDEN ESTABLECIDO PARA MOSTRAR LAS RESPUESTAS
  const queryListingOrderBy = getQueryOrderByListing(order_by);

  //PROMESA QUE HACE 2 CONSULTAS A LA BD, LA PRIMERA OBTIENE EL TOTAL DE RESULTADOS OBTENIDOS APLICANDO LOS FILTROS, LA SEGUNDA
  //OBTIENE LOS RESULTADOS OBTENIDOS APLICANDO LOS FILTROS
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

  //SI NO SE ENCUENTRA NINGÚN ANUNCIO APLICANDO LOS FILTROS
  if (listings === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  //RESPUESTA
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

/*
 * Función anónima que recibe la request y la response.
 * Añade un anuncio a favoritos, lo guarda en la BD y lo devuelve en la response.
 */
const addListingToUserFavoritesListings = async (
  req = request,
  res = response
) => {
  const { id_listing, id_user } = req.query;

  //VERIFICA SI UN ANUNCIO QUE QUIERE AÑADIRSE A FAVORITOS YA ESTA AÑADIDO A LOS FAVORITOS DEL USUARIO
  const validateListing = await User.find({
    $and: [{ id: id_user }, { favorite_listings: id_listing }],
  });

  //SI EL ANUNCIO YA ESTA AÑADIDO A LOS FAVORITOS DEL USUARIO
  if (validateListing.length > 0) {
    return res.json({
      msg: `El anuncio con id ${id_listing} ya esta añadido a la lista de favoritos del usuario`,
    });
  }

  //MODIFICA LA ENTRADA DE LA COLECCIÓN USERS DE LA BD QUE HACE REFERENCIA AL USUARIO, AÑADIENDOLE EL ANUNCIO AL CAMPO FAVORITE_LISTINGS
  const user = await User.findByIdAndUpdate(
    id_user,
    {
      $push: { favorite_listings: id_listing },
    },
    { new: true }
  )
    .select({
      password: 0,
      // google: 0,
      // state: 0,
      __v: 0,
    })
    .where({
      state: true,
    });
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "created_by",
  //     model: "User",
  //     select: {
  //       password: 0,
  //       google: 0,
  //       favorite_listings: 0,
  //       state: 0,
  //       __v: 0,
  //     },
  //   },
  // })
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "address",
  //     model: "Address",
  //     select: { __v: 0 },
  //   },
  // })
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "pets_allowed",
  //     model: "Pets_allowed",
  //     select: { __v: 0 },
  //   },
  // })
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "photos",
  //     model: "Photo",
  //     select: { __v: 0 },
  //   },
  // });

  //SI NO SE HA MODIFICADO EL USUARIO
  if (user === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  //RESPUESTA
  return res.json({
    msg: "Anuncio añadido a favoritos con éxito.",
    user,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Elimina un anuncio de favoritos del usuario de la BD y lo devuelve en la response.
 */
const deleteListingToUserFavoritesListings = async (
  req = request,
  res = response
) => {
  const { id_listing, id_user } = req.query;

  //VERIFICA SI EL ANUNCIO QUE QUIERE ELIMINARSE DE FAVORITOS ESTA AÑADIDO A LOS FAVORITOS DEL USUARIO
  const validateListing = await User.find({
    $and: [{ id: id_user }, { favorite_listings: id_listing }],
  });

  //SI NO ESTA AÑADIDO
  if (validateListing.length == 0) {
    return res.json({
      msg: `El anuncio con id ${id_listing} no esta añadido a la lista de favoritos del usuario`,
    });
  }

  //MODIFICA LA ENTRADA DE LA COLECCIÓN USERS DE LA BD QUE HACE REFERENCIA AL USUARIO, ELIMINANDOLE EL ANUNCIO AL CAMPO FAVORITE_LISTINGS
  const user = await User.findByIdAndUpdate(
    id_user,
    {
      $pull: { favorite_listings: id_listing },
    },
    { new: true }
  )
    .select({
      password: 0,
      // google: 0,
      // state: 0,
      __v: 0,
    })
    .where({
      state: true,
    });
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "created_by",
  //     model: "User",
  //     select: {
  //       password: 0,
  //       google: 0,
  //       favorite_listings: 0,
  //       state: 0,
  //       __v: 0,
  //     },
  //   },
  // })
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "address",
  //     model: "Address",
  //     select: { __v: 0 },
  //   },
  // })
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "pets_allowed",
  //     model: "Pets_allowed",
  //     select: { __v: 0 },
  //   },
  // })
  // .populate({
  //   path: "favorite_listings",
  //   populate: {
  //     path: "photos",
  //     model: "Photo",
  //     select: { __v: 0 },
  //   },
  // });

  //SI NO SE HA MODIFICADO EL USUARIO
  if (user === null) {
    return res.json({
      msg: "Sin resultados de la Base de Datos. Ningún anuncio encontrado.",
    });
  }

  //RESPUESTA
  return res.json({
    msg: "Anuncio eliminado de favoritos con éxito.",
    user,
  });
};

/*
 * Función anónima que recibe la request y la response.
 * Añade imágenes a un anuncio ya creado.
 */
const addPhotosToListing = async (req = request, res = response) => {
  const { id_user, id_listing } = req.query;

  let photos;

  //VALIDA SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  //SI EL ANUNCIO NO PERTENECE AL USUARIO
  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al comprobar la pertenencia al usuario del anuncio",
    });
  }

  //*PHOTOS
  //SE COMPRUEBA SI NO SE HA MANDADO NINGUNA IMAGEN QUE AÑADIR AL ANUNCIO
  if (req.files !== null && req.files !== undefined) {
    try {
      //LLAMA A LA FUNCIÓN DE LOS HELPERS ENCARGADA DE SUBIR LAS IMÁGENES A CLOUDINARY
      photos = await uploadFiles(id_user, req.files.photos);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Ha ocurrido un error en el servidor cuando se ha intentado subir las fotos a Cloudinary.",
      });
    }
  } else {
    return res.status(400).json({
      msg: "No se ha incluido ninguna imagen para añadirla al anuncio.",
    });
  }

  //SE AÑADEN LAS FOTOS A LA BD
  if (photos !== undefined) {
    for (const photo of photos) {
      await photo.save();
    }
  }

  //SE ACTUALIZA EL LISTING AÑADIENDOLE AL CAMPO PHOTOS LAS NUEVAS IMÁGENES
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

/*
 * Función anónima que recibe la request y la response.
 * Elimina imágenes de un anuncio ya creado.
 */
const deletePhotosToListing = async (req = request, res = response) => {
  const { id_user, id_listing } = req.query;
  let photosRequest = req.body.photos;
  let photosDeleteCloudinary = [];
  let listing;

  //SE COMPRUEBA SI SOLO SE MANDA UNA PHOTO PARA GUARDARLA EN UN ARRAY CON EL QUE TRABAJAR
  //(si se recibe solo 1 foto, viene como un objeto, si se recibe más de 1, viene como array)
  if (Array.isArray(photosRequest) == false) {
    photosRequest = [photosRequest];
  }

  //VALIDA QUE SE ADJUNTEN PHOTOS A LA PETICION
  if (photosRequest[0] === null || photosRequest[0] === undefined) {
    return res.status(400).json({
      msg: "No se ha incluido ninguna imagen para añadirla al anuncio.",
    });
  }

  //VALIDA SI EL ANUNCIO PERTENECE AL USUARIO
  const validateListing = await Listing.find({
    _id: id_listing,
    created_by: id_user,
  });

  //SI EL ANUNCIO NO PERTENECE AL USUARIO
  if (validateListing.length === 0) {
    return res.json({
      msg: "Error al comprobar la pertenencia del anuncio al usuario",
    });
  }

  //OBTIENE TODAS LAS IMÁGENES DEL ANUNCIO
  const validatePhotosInListing = await Listing.findById(id_listing, {
    _id: 0,
    photos: 1,
  });

  //COMPRUEBA SI LAS PHOTOS QUE SE QUIEREN ELIMINAR PERTENECEN AL ANUNCIO DEL QUE SE QUIEREN ELIMNAR COMPARANDOLAS ENTRE SI
  for (const photoId of photosRequest) {
    if (!validatePhotosInListing.photos.includes(photoId)) {
      return res.status(400).json({
        msg: `La imagen con id ${photoId} no pertenece al anuncio del que se quiere eliminar. Todas las fotos mandadas tienen que pertenecer al anuncio del que se quieren borrar.`,
      });
    }

    //SE OBTIENE LA FOTO ENTERA DE LA BD PARA PODER TRABAJAR CON ELLA
    const photo = await Photo.findById(photoId);
    photosDeleteCloudinary.push(photo);
  }

  //ELMINA PHOTOS DE CLOUDINARY
  try {
    //LLAMA A LA FUNCIÓN DE LOS HELPERS ENCARGADA DE ELIMINAR LAS IMÁGENES A CLOUDINARY
    photos = deleteFiles(photosDeleteCloudinary);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ha ocurrido un error en el servidor cuando se ha intentado subir las fotos a Cloudinary.",
    });
  }

  //ELIMINA LAS FOTOS DE LA BD Y ACTUALIZA EL ANUNCIO
  for (const photoId of photosRequest) {
    //elimina
    await Photo.findByIdAndRemove(photoId);

    //actualiza (hay que hacer el borrado de las fotos en el listing 1 a 1 porque el pull solo acepta 1 elemento)
    listing = await Listing.findByIdAndUpdate(
      id_listing,
      {
        $pull: { photos: photoId },
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
  }

  //RESPUESTA
  return res.json({
    msg: "Imágenes eliminadas con éxito",
    listing,
  });
};

//EXPORTS
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
