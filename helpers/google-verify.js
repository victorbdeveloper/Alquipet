//IMPORTS NODE
const { OAuth2Client } = require("google-auth-library");

//IMPORTS PROYECTO
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/*
 * Función que recibe un token JWT de Google.
 * Valida si el token recibido es correcto o esta corrupto y si es válido devuelve los datos necesarios de él.
 */
async function googleVerify(token = "") {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  // const payload = ticket.getPayload(); //AQUI TENDRIAMOS TODA LA INFORMACION DEL TOKEN EN LA CONSTANTE PAYLOAD

  //DESESTRUCTURAMOS LA INFORMACION PARA SOLO UTILIZAR LO QUE QUERAMOS
  const { given_name, family_name, email } = ticket.getPayload();

  //const userid = payload["sub"];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  return {
    given_name,
    family_name,
    email,
  };
}

//EXPORTS
module.exports = {
  googleVerify,
};
