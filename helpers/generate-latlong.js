//IMPORTS NODE
const axios = require("axios");

/*
 * Función que recibe una direccion.
 * Genera la latitud y la longitud en base a la dirección pasada por argumentos.
 */
async function generateLatLong(address = "") {
  if (address === "") {
    throw new Error(`Tienes que pasar una dirección completa`);
  }

  //PARAMETROS NECESARIOS PARA REALIZAR LA PETICIÓN A MAPBOX
  const paramsMapBox = {
    country: "es",
    limit: 1,
    types: "address",
    language: "es",
    access_token: process.env.MAPBOX_KEY,
  };

  try {
    // PETICIÓN HTTPS A LA API DE MAPBOX PASANDOLE LOS PARAMETROS
    const intance = axios.create({
      baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/
      ${address.street} ${address.postal_code} ${address.municipality} ${address.province}.json`,
      params: paramsMapBox,
    });

    const resp = await intance.get();

    //RESPUESTA DE LA PETICIÓN
    return resp.data.features.map((location) => ({
      long: location.center[0],
      lat: location.center[1],
    }));
  } catch (error) {
    return undefined;
  }
}

//EXPORTS
module.exports = {
  generateLatLong,
};
