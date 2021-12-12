# Alquipet

_Proyecto que recoge el desarrollo de la parte back (realizada en node) del proyecto Alquipet y con el que se realizará el despligue final del proyecto completo a un hosting real, después de combinarlo con el proyecto "Alquipet FRONT" (realizado en flutter web)._

## Comenzando 🚀

- Descargar el proyecto del siguiente repositorio público de GitHub:
Proyecto Alquipet - [Alquipet](https://github.com/victorbdeveloper/Alquipet)

### Pre-requisitos 📋

- Instalar la última versión de Node.js:
La puedes encontrar aquí: [Node.js](https://nodejs.org/es/)

### Instalación 🔧

- Ir a la consola o a la terminal y ejecutar los siguientes comandos para descargar y actualizar todos los paquetes necesarios para poder compilar y ejecutar el proyecto:

```sh
npm install
npm update
```

- Crear un archivo en la raíz del proyecto llamado ".env". En este archivo se guardarán las variables de entorno del proyecto. Las variables de entorno se establecen como [Key=Value]. En el archivo "example.env", ubicado en la raíz del proyecto, se encuentran unos "ejemplos" de todas las variables de entorno necesarias en el proyecto. ¡Muy importante respetar el nombre de la Key! Lo más sencillo sería copiar todas las variables ubicadas en "example.env" y pegarlas en ".env" y solo sustituir los valores de estas variables, ayudándose para ello, de la descripción escrita en el Value de cada variable de entorno.

```sh
# PUERTO
PORT=puerto por el que se va a ejecutar la parte del servidor del proyecto.

# NOMBRE DE USUARIO DE LA CUENTA DE ADMINISTRADOR QUE TIENE ACCESO A LA BASE DE DATOS
USERNAME_ADMIN_DB_MONGO=nombre de usuario de la cuenta de administrador que tiene acceso a la base de datos.
```

- Después de realizar todos los pasos anteriores puedes poner en marcha el servidor ejecutando en la consola o en la terminal el siguiente comando:

```sh
node app
```

- Como este proyecto es un Rest Server, no devolverá ningún resultado visible ni mostrará nada en pantalla, pero, para confirmar que está funcionando de manera correcta, se puede consultar la consola o terminal. Después de ejecutar el comando anterior, deberían verse unos mensajes/logs que confirman el puerto en el que está ejecutándose el Server y la conexión a la Base de Datos.

> Servidor corriendo en el puerto:  8081
> DATABASE OnLine

- Para poder confirmar el completo funcionamiento de todo el Rest Server y poder realizar pruebas contra él, se ha facilitado un entorno de pruebas creado con la herramienta [POSTMAN](https://www.postman.com/). Para acceder al entorno de pruebas, solo habrá que crearse una cuenta en Postman y pinchar en el siguiente botón:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/594403f2c10574c651f9?action=collection%2Fimport)
También se adjunta toda la documentación del entorno de pruebas que hace referencia a todo el contenido del proyecto en esta url:
[Alquipet Documentation POSTMAN](https://documenter.getpostman.com/view/18019252/UVR5q94i)

## Construido con 🛠️

_Las herramientas utilizadas en el desarrollo del proyecto son:_

- [Node.js](https://nodejs.org/es/) - El framework más famoso de javascript para el desarrollo del backend
- [MongoDB](https://mongodb.com/) - La Base de Datos no relacional más utilizada
- [Heroku](https://heroku.com/) - El hosting gratuito más sencillo de utilizar
- [Google Domains](https://domains.google.com) - El generador de dominios más fiable
- [Cloudinary](https://cloudinary.com) - Repsitorio onCloud, donde almacenar todo el contenido multimedia del proyecto
- [MapBox](https://mapbox.com) - Servicio gratuito para gestión de mapas y trabajos con rutas y coordenadas

## Wiki 📖

Puedes encontrar mucho más de cómo utilizar este proyecto en las [Notas NODE Y HEROKU](https://drive.google.com/drive/folders/1mh52ug_3rlSjs5Mrw7daH9AOMpF6-6q3)

## Versionado 📌

Se ha utilizado [Git](https://git-scm.com/) para el control de versiones, en conjunto con [GitHub](https://github.com) como medio para alojar los repositorios, y junto a la herramienta [Sourcetree](https://www.sourcetreeapp.com/) como gestor de interfaz.

## Autores ✒️

- **Víctor Bartolomé Sivelo** [victorbdeveloper](https://github.com/victorbdeveloper/)
