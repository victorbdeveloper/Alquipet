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
  createListing,
  getListingById,
  getFilteredListingPaginated,
  updateListing,
  deleteListing,
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
      "Establecer si se admiten mascotas exóticas debe ser true o false"
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
      "Establecer si se admiten mascotas exóticas debe ser true o false"
    )
      .optional(true)
      .isNumeric(),
    check(
      "index_limit",
      "Establecer si se admiten mascotas exóticas debe ser true o false"
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
    // check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    // check("id").custom(userExistsById),
    // check("password", "El password debe tener mas de 6 dígitos")
    //   .optional(true)
    //   .isLength({
    //     min: 6,
    //   }),
    // check("phone", "El teléfono no es correcto").optional(true).isMobilePhone(),

    //check("role").custom(isRoleValid),
    validateRequest,
  ],
  updateListing
);

//PETICIÓN DELETE
router.delete(
  "/delete_listing",
  [
    validateJWT,
    // check("id", "El id debe de ser un id vádilo de MongoDB").isMongoId(),
    // check("id").custom(userExistsById),
    validateRequest,
  ],
  deleteListing
);

//TODO: FALTAN DE AÑADIR ADD_PHOTO, DELETE_PHOTO, ADD_FAVORITE, DELETE_FAVORITE

module.exports = router;
