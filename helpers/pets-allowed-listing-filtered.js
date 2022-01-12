//IMPORTS PROYECTO
const PetsAllowed = require("../models/pets-allowed.model");

/*
 * Función que recibe un objeto con las mascotas permitidas.
 * Genera y devuelve una query válida para una petición a la BD en la que se quiere obtener los anuncios filtrados.
 * Filtra los anuncios por las mascotas permitidas.
 */
async function getPetsAllowedListingFiltered(pets) {
  let petsAllowed = [];

  //CREA EL OBJETO CON LOS DATOS RECIBIDOS POR PARÁMETROS
  let queryPets = {
    dogs: pets.dogs,
    cats: pets.cats,
    birds: pets.birds,
    rodents: pets.rodents,
    exotic: pets.exotic,
    others: pets.others != false ? { $exists: true } : false,
  };

  //ELIMINA DEL OBJETO QUERYPETS LAS OPCIONES QUE VIENEN COMO UNDEFINDED PARA QUE NO DE ERROR CUANDO SE EJECUTE LA CONSULTA
  if (pets.dogs === undefined) delete queryPets.dogs;
  if (pets.cats === undefined) delete queryPets.cats;
  if (pets.birds === undefined) delete queryPets.birds;
  if (pets.rodents === undefined) delete queryPets.rodents;
  if (pets.exotic === undefined) delete queryPets.exotic;
  if (pets.others === undefined) delete queryPets.others;

  //SI EL OBJETO NO HA QUEDADO VACÍO BUSCA EN LA BD TODOS LAS ENTRADAS DE LA COLECCIÓN PETS_ALLOWED DONDE SE CUMPLEN LOS FILTROS
  if (Object.entries(queryPets).length > 0) {
    [petsAllowed] = await Promise.all([
      PetsAllowed.find(queryPets, { _id: 1 }),
    ]);
  }
  // console.log(petsAllowed);
  return petsAllowed;
}

//EXPORTS
module.exports = {
  getPetsAllowedListingFiltered,
};
