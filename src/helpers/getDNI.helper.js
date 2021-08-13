const axios = require("axios").default;

const Admin = require("./admin.helper");
const Utils = require("./utils.helper");

const dniHandler = {
     operation: async(dni) => {
          var query = new URLSearchParams();
          query.set("dni", dni);

          const url = Admin.API("DNI");

          if (url)
               return await axios
                    .get(url.concat("?", query.toString()))
                    .then((res) => res.data)
                    .catch((err) => Utils.err(err));
          return null;
     },
     result: ({ DNI, Nombre, Paterno, Materno, DigitoVerificacion }) => ({
          dni: DNI || null,
          digito: DigitoVerificacion || null,
          apellido_paterno: Paterno || null,
          apellido_materno: Materno || null,
          nombres: Nombre || null,
          nombres_completos: `${Paterno ? Paterno : ""} ${Materno ? Materno : ""} ${Nombre ? Nombre : ""}`,
          f_nacimiento: null,
          sexo: null,
          direccion: null,
          departamento: null,
          provincia: null,
          distrito: null,
     }),
};

module.exports = async (dni) =>
     await dniHandler
          .operation(dni)
          .then((data) => dniHandler.result(data))
          .catch((error) => new Error(error));
