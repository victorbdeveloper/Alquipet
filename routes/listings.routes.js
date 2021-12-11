const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateJWT,
  validatePetsAllowed,
  validateFiles,
  validateRequest,
} = require("../middlewares/index.middlewares");

const {
  userExistsById,
  listingExistsById,
} = require("../helpers/index.helper");

const {
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
} = require("../controllers/listing.controller");

const router = Router();

//PETICIÓN GET
router.get(
  "/get_listing_by_id",
  [
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(listingExistsById),
    validateRequest,
  ],
  getListingById
);

//PETICIÓN GET
router.get(
  "/get_filtered_my_listings_paginated",
  [
    validateJWT,
    check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id").custom(userExistsById),
    check("price_max", "El precio debe ser un número")
      .optional(true)
      .isNumeric(),
    check("price_min", "El precio debe ser un número")
      .optional(true)
      .isNumeric(),
    check("dogs", "Establecer si se admiten perros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("cats", "Establecer si se admiten gatos debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("birds", "Establecer si se admiten pájaros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("rodents", "Establecer si se admiten roedores debe ser true o false")
      .optional(true)
      .isBoolean(),
    check(
      "exotic",
      "Establecer si se admiten mascotas exóticas debe ser true o false"
    )
      .optional(true)
      .isBoolean(),
    check(
      "others",
      "Establecer si se admiten otro tipo de mascotas debe ser true o false"
    )
      .optional(true)
      .isBoolean(),
    check(
      "order_by",
      "La opción debe ser una de la siguientes [price_max, price_min, date_newest, date_oldest]"
    )
      .optional(true)
      .isIn(["price_max", "price_min", "date_newest", "date_oldest"]),
    check(
      "index_from",
      "El indice por el que empezar a mostrar anuncios debe ser un número"
    )
      .optional(true)
      .isNumeric(),
    check(
      "index_limit",
      "El indice hasta el que se quieren mostrar anuncios debe ser un número"
    )
      .optional(true)
      .isNumeric(),
    validateRequest,
  ],
  getFilteredMyListingsPaginated
);

//PETICIÓN GET
router.get(
  "/get_filtered_listing_paginated",
  [
    check("price_max", "El precio debe ser un número")
      .optional(true)
      .isNumeric(),
    check("price_min", "El precio debe ser un número")
      .optional(true)
      .isNumeric(),
    check("dogs", "Establecer si se admiten perros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("cats", "Establecer si se admiten gatos debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("birds", "Establecer si se admiten pájaros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("rodents", "Establecer si se admiten roedores debe ser true o false")
      .optional(true)
      .isBoolean(),
    check(
      "exotic",
      "Establecer si se admiten mascotas exóticas debe ser true o false"
    )
      .optional(true)
      .isBoolean(),
    check(
      "others",
      "Establecer si se admiten otro tipo de mascotas debe ser true o false"
    )
      .optional(true)
      .isBoolean(),
    check(
      "order_by",
      "La opción debe ser una de la siguientes [price_max, price_min, date_newest, date_oldest]"
    )
      .optional(true)
      .isIn(["price_max", "price_min", "date_newest", "date_oldest"]),
    check(
      "index_from",
      "El indice por el que empezar a mostrar anuncios debe ser un número"
    )
      .optional(true)
      .isNumeric(),
    check(
      "index_limit",
      "El indice hasta el que se quieren mostrar anuncios debe ser un número"
    )
      .optional(true)
      .isNumeric(),
    validateRequest,
  ],
  getFilteredListingPaginated
);

//PETICIÓN POST
router.post(
  "/create_listing",
  [
    validateJWT,
    check(
      "created_by",
      "El usuario que ha creado el anuncio es obligatorio"
    ).notEmpty(),
    check(
      "created_by",
      "El usuario no tiene un id de MongoDB válido"
    ).isMongoId(),
    check("created_by").custom(userExistsById),
    check("province", "La provincia de la dirección es obligatoria").notEmpty(),
    check(
      "municipality",
      "El municipio de la dirección es obligatorio"
    ).notEmpty(),
    check(
      "postal_code",
      "El código postal de la dirección es obligatorio"
    ).notEmpty(),
    check("street", "La calle de la dirección es obligatoria").notEmpty(),
    check("number", "El número de la dirección es obligatorio").notEmpty(),
    check("flour", "El piso de la dirección es obligatorio").notEmpty(),
    check("letter", "La letra de la dirección es obligatoria").notEmpty(),
    validatePetsAllowed,
    check("dogs", "Establecer si se admiten perros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("cats", "Establecer si se admiten gatos debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("birds", "Establecer si se admiten pájaros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("rodents", "Establecer si se admiten roedores debe ser true o false")
      .optional(true)
      .isBoolean(),
    check(
      "exotic",
      "Establecer si se admiten mascotas exóticas debe ser true o false"
    )
      .optional(true)
      .isBoolean(),
    validateFiles,
    check("price", "El precio del alquiler es obligatorio").notEmpty(),
    check(
      "price",
      "El precio del alquiler tiene que ser un número"
    ).isNumeric(),
    check("description", "La descripción del anuncio debe ser un texto")
      .optional(true)
      .isString(),
    validateRequest,
  ],
  createListing
);

//PETICIÓN PUT
router.put(
  "/update_listing",
  [
    validateJWT,
    check(
      "id_user",
      "El id del usuario debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_user").custom(userExistsById),
    check(
      "id_listing",
      "El id del anuncio debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_listing").custom(listingExistsById),
    check("province", "El campo provincia no puede estar vacío").notEmpty(),
    check("municipality", "El campo municipio no puede estar vacío").notEmpty(),
    check(
      "postal_code",
      "El campo código postal no puede estar vacío"
    ).notEmpty(),
    check("street", "El campo calle no puede estar vacío").notEmpty(),
    check("number", "El campo número no puede estar vacío").notEmpty(),
    check("flour", "El campo piso no puede estar vacío").notEmpty(),
    check("letter", "El campo letra no puede estar vacío").notEmpty(),
    validatePetsAllowed,
    check(
      "dogs",
      "Establecer si se admiten perros debe ser true o false"
    ).isBoolean(),
    check(
      "cats",
      "Establecer si se admiten gatos debe ser true o false"
    ).isBoolean(),
    check(
      "birds",
      "Establecer si se admiten pájaros debe ser true o false"
    ).isBoolean(),
    check(
      "rodents",
      "Establecer si se admiten roedores debe ser true o false"
    ).isBoolean(),
    check(
      "exotic",
      "Establecer si se admiten mascotas exóticas debe ser true o false"
    ).isBoolean(),
    check(
      "others",
      "El campo others hay que pasarlo aunque esté vacío"
    ).isString(),
    check("price", "El precio del alquiler es obligatorio").notEmpty(),
    check(
      "price",
      "El precio del alquiler tiene que ser un número"
    ).isNumeric(),
    check(
      "description",
      "El campo description hay que pasarlo aunque esté vacío"
    ).isString(),
    validateRequest,
  ],
  updateListing
);

//PETICIÓN DELETE
router.delete(
  "/delete_listing",
  [
    validateJWT,
    check(
      "id_user",
      "El id del usuario debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_user").custom(userExistsById),
    check(
      "id_listing",
      "El id del anuncio debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_listing").custom(listingExistsById),
    validateRequest,
  ],
  deleteListing
);

//PETICIÓN GET
router.get(
  "/get_filtered_user_favorites_listings_paginated",
  [
    validateJWT,
    check("id_user", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id_user").custom(userExistsById),
    check("price_max", "El precio debe ser un número")
      .optional(true)
      .isNumeric(),
    check("price_min", "El precio debe ser un número")
      .optional(true)
      .isNumeric(),
    check("dogs", "Establecer si se admiten perros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("cats", "Establecer si se admiten gatos debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("birds", "Establecer si se admiten pájaros debe ser true o false")
      .optional(true)
      .isBoolean(),
    check("rodents", "Establecer si se admiten roedores debe ser true o false")
      .optional(true)
      .isBoolean(),
    check(
      "exotic",
      "Establecer si se admiten mascotas exóticas debe ser true o false"
    )
      .optional(true)
      .isBoolean(),
    check(
      "others",
      "Establecer si se admiten otro tipo de mascotas debe ser true o false"
    )
      .optional(true)
      .isBoolean(),
    check(
      "order_by",
      "La opción debe ser una de la siguientes [price_max, price_min, date_newest, date_oldest]"
    )
      .optional(true)
      .isIn(["price_max", "price_min", "date_newest", "date_oldest"]),
    check(
      "index_from",
      "El indice por el que empezar a mostrar anuncios debe ser un número"
    )
      .optional(true)
      .isNumeric(),
    check(
      "index_limit",
      "El indice hasta el que se quieren mostrar anuncios debe ser un número"
    )
      .optional(true)
      .isNumeric(),
    validateRequest,
  ],
  getFilteredUserFavoritesListingsPaginated
);

//PETICIÓN PUT
router.put(
  "/add_listing_to_user_favorites_listings",
  [
    validateJWT,
    check(
      "id_user",
      "El id del usuario debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_user").custom(userExistsById),
    check(
      "id_listing",
      "El id del anuncio debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_listing").custom(listingExistsById),
    validateRequest,
  ],
  addListingToUserFavoritesListings
);

//PETICIÓN DELETE
router.delete(
  "/delete_listing_to_user_favorites_listings",
  [
    validateJWT,
    check(
      "id_user",
      "El id del usuario debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_user").custom(userExistsById),
    check(
      "id_listing",
      "El id del anuncio debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_listing").custom(listingExistsById),
    validateRequest,
  ],
  deleteListingToUserFavoritesListings
);

//PETICIÓN PUT
router.put(
  "/add_photos_to_listing",
  [
    validateJWT,
    check("id_user", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id_user").custom(userExistsById),
    check(
      "id_listing",
      "El id del anuncio debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_listing").custom(listingExistsById),
    validateFiles,
    validateRequest,
  ],
  addPhotosToListing
);

//PETICIÓN DELETE
router.delete(
  "/delete_photos_to_listing",
  [
    validateJWT,
    check("id_user", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    check("id_user").custom(userExistsById),
    check(
      "id_listing",
      "El id del anuncio debe de ser un id vádilo de MongoDB"
    ).isMongoId(),
    check("id_listing").custom(listingExistsById),

    validateRequest,
  ],
  deletePhotosToListing
);

module.exports = router;
