//FUNCIÓN QUE GENERA LA QUERY PARA FILTRAR LOS ANUNCIOS
function getQueryFilterListing(
  params,
  addresses,
  petsAllowed,
  inListingsArray
) {
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

  if (inListingsArray === undefined) delete queryListing._id;
  if (addresses.length === 0) delete queryListing.address;
  if (petsAllowed.length === 0) delete queryListing.pets_allowed;

  return queryListing;
}

//FUNCIÓN QUE GENERA LA QUERY PARA ORDENAR LOS ANUNCIOS
function getQueryOrderByListing(order_by) {
  let queryListingOrderBy = {
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
      queryListingOrderBy.date_publication = -1;
      delete queryListingOrderBy.price;
      break;
  }

  return queryListingOrderBy;
}

module.exports = {
  getQueryFilterListing,
  getQueryOrderByListing,
};
