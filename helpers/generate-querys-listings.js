/*
 * Función que recibe por parámetros los datos necesarios para generar el query de una peticion a la BD.
 * Genera y devuelve una query válida para una petición a la BD en la que se quiere obtener los anuncios filtrados.
 */
//FUNCIÓN QUE GENERA LA QUERY PARA FILTRAR LOS ANUNCIOS
function getQueryFilterListing(
  params,
  addresses,
  petsAllowed,
  inListingsArray
) {
  //GENERA LA QUERY EN BASE LOS DATOS RECIBIDOS POR PARÁMETROS
  let queryListing = {
    _id: { $in: inListingsArray },
    $and: [
      {
        price: {
          $gt:
            params.price_min === undefined ? 0 : parseInt(params.price_min) - 1,
        },
      },
      {
        price: {
          $lte:
            params.price_max === undefined
              ? 9999999
              : parseInt(params.price_max),
        },
      },
    ],
    state: true,
    address: { $in: addresses },
    pets_allowed: { $in: petsAllowed },
  };

  //ELIMINA DEL OBJETO QUERYLISTING LAS OPCIONES QUE VIENEN COMO UNDEFINDED O CON VALOR 0 PARA QUE NO DE ERROR CUANDO SE EJECUTE LA CONSULTA
  if (inListingsArray === undefined) delete queryListing._id;
  if (addresses.length === 0) delete queryListing.address;
  if (petsAllowed.length === 0) delete queryListing.pets_allowed;
;
  return queryListing;
}

/*
 * Función que recibe un string con la forma en la que quieren ordenarse los resultados de una consulta.
 * Genera la query para ordenar los anuncios y luego la devuelve.
 */
function getQueryOrderByListing(order_by) {
  let queryListingOrderBy = {
    date_publication: -1,
    price: 0,
  };

  //DEPENDIENDO DE EL VALOR QUE TENGA LA PROPIEDAD PASADA POR PARÁMETROS, MODIFICA O ELIMINA DEL OBJETO QUERYLISTINGORDERBY
  //LAS OPCIONES QUE VIENEN COMO UNDEFINDED O CON VALOR 0 PARA QUE NO DE ERROR CUANDO SE EJECUTE LA CONSULTA
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
      queryListingOrderBy.date_publication = 1;
      delete queryListingOrderBy.price;
      break;
    default:
      queryListingOrderBy.date_publication = -1;
      delete queryListingOrderBy.price;
      break;
  }

  return queryListingOrderBy;
}

//EXPORTS
module.exports = {
  getQueryFilterListing,
  getQueryOrderByListing,
};
