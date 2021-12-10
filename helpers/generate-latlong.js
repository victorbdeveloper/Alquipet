const axios = require("axios");

async function generateLatLong(address = "") {
  if (address === "") {
    throw new Error(`Tienes que pasar una dirección completa`);
  }

  const paramsMapBox = {
    country: "es",
    limit: 1,
    types: "address",
    language: "es",
    access_token: process.env.MAPBOX_KEY,
  };

  try {
    // Petición http
    const intance = axios.create({
      baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/
      ${address.street} ${address.postal_code} ${address.municipality} ${address.province}.json`,
      params: paramsMapBox,
    });

    const resp = await intance.get();

    return resp.data.features.map((location) => ({
      long: location.center[0],
      lat: location.center[1],
    }));
  } catch (error) {
    return undefined;
  }
}

module.exports = {
  generateLatLong,
};
