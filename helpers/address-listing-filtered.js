//IMPORTS PROYECTO
const Address = require("../models/address.model");

/*
 * Función que recibe la provincia.
 * Filtra los anuncios por la provincia.
 */
async function getAddressListingFiltered(province = "") {
  const regex = new RegExp(province, "i"); //expresión regular para no tener en cuenta las mayúsculas y minúsculas

  //BUSCA EN LA BASE DE DATOS TODAS LAS ENTRADAS DE LA COLECCIÓN ADDRESSES EN LAS QUE LA PROVINCIA SEA LA MISMA QUE LA
  //PASADA POR PARÁMETROS Y LAS DEVUELVE EN UN ARRAY
  let [addresses] = await Promise.all([
    Address.find(
      {
        province: regex,
      },
      { _id: 1 }
    ),
  ]);

  return [addresses];
}

//EXPORTS
module.exports = {
  getAddressListingFiltered,
};
