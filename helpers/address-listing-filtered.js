const Address = require("../models/address.model");

//FUNCIÓN QUE FILTRA LOS ANUNCIOS POR LA DIRECCIÓN
async function getAddressListingFiltered(province = "") {
  const regex = new RegExp(province, "i"); //expresión regular para no tener en cuenta las mayus y minus

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

module.exports = {
  getAddressListingFiltered,
};
