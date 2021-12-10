const PetsAllowed = require("../models/pets-allowed.model");

//FUNCIÓN QUE FILTRA LOS ANUNCIOS POR LAS MASCOTAS ADMITIDAS
async function getPetsAllowedListingFiltered(pets) {
  let petsAllowed = [];

  let queryPets = {
    dogs: pets.dogs,
    cats: pets.cats,
    birds: pets.birds,
    rodents: pets.rodents,
    exotic: pets.exotic,
    others: pets.others != false ? { $exists: true } : false,
  };

  if (pets.dogs === undefined) delete queryPets.dogs;
  if (pets.cats === undefined) delete queryPets.cats;
  if (pets.birds === undefined) delete queryPets.birds;
  if (pets.rodents === undefined) delete queryPets.rodents;
  if (pets.exotic === undefined) delete queryPets.exotic;
  if (pets.others === undefined) delete queryPets.others;

  if (Object.entries(queryPets).length > 0) {
    [petsAllowed] = await Promise.all([
      PetsAllowed.find(queryPets, { _id: 1 }),
    ]);
  }

  return petsAllowed;
}

module.exports = {
  getPetsAllowedListingFiltered,
};
