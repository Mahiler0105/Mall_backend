const https = require("https");
const fetch = require("node-fetch");
const AbortController = require("node-abort-controller");
import { sign } from "jsonwebtoken";
const httpAgent = new https.Agent({ rejectUnauthorized: false });

const dniHandler = {
     token: {
          operationName: "createToken",
          variables: { email: "benjy01278@gmail.com", password: "Benja271999" },
          query: `query createToken($email: String!, $password: String!)
        {login(email: $email, password: $password) {authentication}}`,
     },
     dniSave: (numdoc, type = "dniPremium") => ({
     // dniSave: (numdoc, type = "dniPlatinum2") => ({
          // operationName: 'consultarDni',
          // variables: {
          //     dni: String(numdoc),
          // },
          // query: `query consultarDni($dni: String!) {${type}(dni: $dni) {${type === 'dniPlatinum' ? 'result' : 'data'}}}`,
          operationName: type === "dniPlatinum2" ? "consultarDniPlatinum" : "consultarDni",
          variables: {
               dni: String(numdoc),
          },
          query: `query ${type === "dniPlatinum2" ? "consultarDniPlatinum" : "consultarDni"}($dni: String!) {${type}(dni: $dni) {${
               type === "dniPlatinum2" ? "result" : "data"
          }}}`,
     }),
     operation: async (params = {}, token = undefined) => {
          return new Promise(async (resolve, reject) => {
               const controller = new AbortController();
               const id = setTimeout(() => {
                    // if (params.operationName === "consultarDniPlatinum" && String(params.query).includes("dniPlatinum2")) {
                         // if (params.operationName === "consultarDni" && String(params.query).includes("dniPlatinum")) {
                         if (params.operationName === "consultarDni" && String(params.query).includes("dniPremium")) {
                         controller.abort();
                         reject({ token, code: 2 });
                    } else reject({ code: 3 });
               }, 8000);

               var inset = { sub: "smartb" };
               if (params.operationName === "consultarDni") inset = { ...inset, pathname: "/aplicativos/dnipremium", tab: "individual" };
               
               var isAuth = sign(
                    inset,
                    'b247ab672c1fe43cadb89c41a8dd3a6a4b32222bb5b97f5c7fcba815249a5e57',
                    { expiresIn: '4h' }
                );

               return await fetch("https://apiapps.aplicativoscontables.pe:3006/api", {
                    method: "POST",
                    body: JSON.stringify(params),
                    headers: {
                         "Content-Type": "application/json",
                         authentication: token,
                         Origin: "https://app.aplicativoscontables.pe",
                         isAuth
                    },
                    agent: httpAgent,
                    signal: controller.signal,
               })
                    .then((response) => {
                         clearTimeout(id);
                         return response.json();
                    })
                    .then((e) => {
                         if (params.operationName === "createToken") {
                              resolve(e.data.login.authentication);
                              return;
                         } else if (String(params.query).includes("dniPremium")) {
                              // console.log(JSON.stringify(e, null, 2))
                              if (e.error) {
                                   reject({ token, code: 2 });
                                   return;
                              }
                              // resolve(e.data.dniPlatinum2.result);
                              resolve(e.data.dniPremium.data.result);
                         } else {
                              console.log(JSON.stringify(e, null, 2));
                              resolve(e.data.dniSimple.data.result);
                         }
                    })
                    .catch((error) => reject(error));
          });
     },
     result: ({
          CUI,
          DNI,
          Apellido_Paterno,
          Paterno,
          Nombres,
          Nombre,
          Fecha_Nacimiento, FechaNacimiento,
          Sexo,
          Apellido_Materno,
          Materno,
          DigitoVerificacion,
          Departamento_Domicilio, Departamento,
          Provincia_Domicilio, Provincia,
          Distrito_Domicilio, Distrito,
          Direccion,
     }) => ({
          dni: DigitoVerificacion ? DNI : !!CUI ? CUI.split(" - ")[0] : null,
          digito: DigitoVerificacion ? DigitoVerificacion : !!CUI ? CUI.split(" - ")[1] : null,
          apellido_paterno: Paterno ? Paterno : Apellido_Paterno !== "" ? Apellido_Paterno : null,
          apellido_materno: Materno ? Materno : Apellido_Materno !== "" ? Apellido_Materno : null,
          nombres: Nombre ? Nombre : Nombres !== "" ? Nombres : null,
          nombres_completos: `${Paterno ? Paterno : Apellido_Paterno} ${Materno ? Materno : Apellido_Materno} ${Nombre ? Nombre : Nombres}`,
          f_nacimiento: Fecha_Nacimiento ||FechaNacimiento|| null,
          sexo: Sexo || null,
          direccion: Direccion || null,
          departamento: Departamento_Domicilio || Departamento||null,
          provincia: Provincia_Domicilio ||Provincia|| null,
          distrito: Distrito_Domicilio ||Distrito|| null,
     }),
};

module.exports = async (dni) =>
     dniHandler
          .operation(dniHandler.token)
          .then(async (token) => dniHandler.operation(dniHandler.dniSave(dni), token))
          .then(async (data) => dniHandler.result(data))
          .catch(async (error) => {
               if (error.code === 2) {
                    return dniHandler
                         .operation(dniHandler.dniSave(dni, "dniSimple"), error.token)
                         .then((data) => dniHandler.result(data))
                         .catch((err) => {
                              throw new Error(err);
                         });
               }
               throw new Error(error);
          });
