const axios = require("axios").default;

// const { Admin, Utils } = require("../helpers");
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
               var persons = [];
               if (data.ruc) {
                    if (String(data.ruc).startsWith(1)) {
                         persons = [
                              {
                                   dni: String(data.ruc).substr(2, 8),
                                   name: data.razonSocial,
                                   address: data.direccion,
                                   department: data.departamento,
                                   province: data.provincia,
                                   district: data.distrito,
                                   date_from: moment(data.fechaInscripcion).tz("America/Lima").format("YYYY-MM-DD"),
                              },
                         ];
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
          throw new Error("Wrong request");
     },
};
module.exports = async (ruc) =>
     await rucHandler
          .operation(ruc)
          .then((data) => rucHandler.result(data))
          .catch((error) => new Error(error));
