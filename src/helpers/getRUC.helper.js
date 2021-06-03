const https = require("https");
const fetch = require("node-fetch");
import { sign } from "jsonwebtoken";

const httpAgent = new https.Agent({ rejectUnauthorized: false });
const rucHandler = {
     token: {
          operationName: "createToken",
          variables: { email: "benjy01278@gmail.com", password: "Benja271999" },
          query: `query createToken($email: String!, $password: String!)
              {login(email: $email, password: $password) {authentication}}`,
     },
     rucSave: (numdoc) => ({
          operationName: "consultarRuc",
          variables: {
               path: "getRuc",
               data: {
                    ruc: numdoc,
               },
          },
          query: "query consultarRuc($path: String!, $data: JSON!) {apirest(path: $path, data: $data) {response,__typename}}",
     }),
     operation: async (params = {}, token = undefined) => {
          try {
               var isAuth = sign({ sub: "smartb" }, "b247ab672c1fe43cadb89c41a8dd3a6a4b32222bb5b97f5c7fcba815249a5e57", { expiresIn: "4h" });

               const pending = await fetch("https://apiapps.aplicativoscontables.pe:3006/api", {
                    method: "POST",
                    body: JSON.stringify(params),
                    headers: {
                         "Content-Type": "application/json",
                         authentication: token,
                         Origin: "https://app.aplicativoscontables.pe",
                         isAuth,
                    },
                    agent: httpAgent,
               });
               // return await pending.json();
               return await pending.json().then(async (e) => {
                    if (params.operationName === "createToken") {
                         return e.data.login.authentication;
                    }
                    return e.data.apirest.response.result;
               });
          } catch (e) {
               console.log(e);
               throw new Error(e);
          }
     },
     result: (data) => {
          var person;
          if (data.RUC) {
               if (String(data.RUC).startsWith(1)) {
                    person = {
                         dni: String(data.RUC).substr(2, 8),
                         name: data.RazonSocial,
                         address: data.Direccion,
                         department: data.Departamento,
                         province: data.Provincia,
                         district: data.Distrito,
                         date_from: new Date(
                              String(data.FechaInicio ? data.FechaInicio : "23/03/2021")
                                   .split("/")
                                   .reverse()
                                   .join("-")
                         ),
                    };
               } else {
                    const CEO = data.RepresentanteLegal[0];
                    person = CEO
                         ? {
                                document: CEO.Documento || null,
                                doc_number: CEO.NroDocumento || null,
                                name: CEO.Nombre || null,
                                charge: CEO.Cargo || null,
                                date_from: new Date(
                                     String(CEO.FechaDesde ? CEO.FechaDesde : "23/03/2021")
                                          .split("/")
                                          .reverse()
                                          .join("-")
                                ),
                           }
                         : {};
               }
          }
          return {
               ruc: data.RUC,
               denomination: data.RazonSocial,
               comercial_name: data.NombreComercial,
               type_society: data.Tipo,
               status: data.Estado,
               condition: data.Condicion,
               person,
          };
     },
};
module.exports = async (ruc) =>
     rucHandler
          .operation(rucHandler.token)
          .then(async (token) => rucHandler.operation(rucHandler.rucSave(ruc), token))
          .then(async (data) => rucHandler.result(data))
          .catch((error) => new Error(error));
