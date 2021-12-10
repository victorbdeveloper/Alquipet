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
    Listing.countDocuments(queryListing).where({ created_by: id }),

    Listing.find(queryListing)
      .where({ created_by: id })
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
      .skip(
        index_from < 1
          ? 0
          : index_from === undefined
          ? 0
          : Number(index_from) - 1
      )
      .limit(Number(index_limit)),
  ]);

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
      .skip(
        index_from < 1
          ? 0
          : index_from === undefined
          ? 0
          : Number(index_from) - 1
      )
      .limit(Number(index_limit)),
  ]);

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
  getListingById,
  getFilteredMyListingsPaginated,
  getFilteredListingPaginated,
  createListing,
  updateListing,
  deleteListing,
};
