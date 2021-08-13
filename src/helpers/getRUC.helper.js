const axios = require("axios").default;

const Admin = require("./admin.helper");
const Utils = require("./utils.helper");

const moment = require("moment");

const rucHandler = {
     operation: async (ruc = null) => {
          var query = new URLSearchParams();
          query.set("ruc", ruc);

          const url = Admin.API("RUC");

          if (url)
               return await axios
                    .get(url.concat("?", query.toString()))
                    .then((res) => res.data)
                    .catch((err) => Utils.err(err));
          return null;
     },
     result: (data) => {
          if (data) {
               if (data.ruc) {
                    var persons = [];
                    if (String(data.ruc).startsWith(1)) {
                         const CEO = data.representante;

                         if (CEO) {
                              persons = [
                                   {
                                        dni: CEO.dni,
                                        name: CEO.nombre,
                                        address: CEO.direccion,
                                        department: CEO.departamento,
                                        province: CEO.provincia,
                                        district: CEO.distrito,
                                        date_from: moment(data.fechaInscripcion).tz("America/Lima").format("YYYY-MM-DD"),
                                   },
                              ];
                         }
                    } else {
                         const CEOS = data.representantes;
                         if (Array.isArray(CEOS)) {
                              persons = Array.from(data.representantes).reduce(
                                   (o, v) => [
                                        ...o,
                                        {
                                             document: v.documento || null,
                                             doc_number: v.nro_documento || null,
                                             name: v.nombre || null,
                                             charge: v.cargo || null,
                                             date_from: moment(v.fecha_desde).tz("America/Lima").format("YYYY-MM-DD"),
                                        },
                                   ],
                                   []
                              );
                         }
                    }
                    return {
                         ruc: data.ruc,
                         denomination: data.razonSocial,
                         comercial_name: data.nombreComercial,
                         type_society: data.tipo,
                         status: data.estado,
                         condition: data.condicion,
                         persons,
                    };
               }

               const error = new Error();
               error.status = 500;
               error.message = data.message;
               throw error;
          }
          throw new Error("Wrong request");
     },
};
module.exports = async (ruc) =>
     await rucHandler
          .operation(ruc)
          .then((data) => rucHandler.result(data))
          .catch((error) => new Error(error));
