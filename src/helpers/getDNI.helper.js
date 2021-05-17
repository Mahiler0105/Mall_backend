const https = require("https");
const fetch = require("node-fetch");
const AbortController = require("node-abort-controller");

const httpAgent = new https.Agent({ rejectUnauthorized: false });

const dniHandler = {
     token: {
          operationName: "createToken",
          variables: { email: "benjy01278@gmail.com", password: "Benja271999" },
          query: `query createToken($email: String!, $password: String!)
        {login(email: $email, password: $password) {authentication}}`,
     },
     dniSave: (numdoc, type = "dniPlatinum2") => ({
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
                    if (params.operationName === "consultarDniPlatinum" && String(params.query).includes("dniPlatinum2")) {
                         // if (params.operationName === "consultarDni" && String(params.query).includes("dniPlatinum")) {
                         controller.abort();
                         reject({ token, code: 2 });
                    } else reject({ code: 3 });
               }, 8000);

               return await fetch("https://apiapp.aplicativoscontables.pe:3006/api", {
                    method: "POST",
                    body: JSON.stringify(params),
                    headers: {
                         "Content-Type": "application/json",
                         authentication: token,
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
                         } else if (String(params.query).includes("dniPlatinum2")) {
                              // console.log(JSON.stringify(e, null, 2))
                              if (e.error) {
                                   reject({ token, code: 2 });
                                   return;
                              }
                              resolve(e.data.dniPlatinum2.result);
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
          Fecha_Nacimiento,
          Sexo,
          Apellido_Materno,
          Materno,
          DigitoVerificacion,
          Departamento_Domicilio,
          Provincia_Domicilio,
          Distrito_Domicilio,
          Direccion,
     }) => ({
          dni: DigitoVerificacion ? DNI : !!CUI ? CUI.split(" - ")[0] : null,
          digito: DigitoVerificacion ? DigitoVerificacion : !!CUI ? CUI.split(" - ")[1] : null,
          apellido_paterno: Paterno ? Paterno : Apellido_Paterno !== "" ? Apellido_Paterno : null,
          apellido_materno: Materno ? Materno : Apellido_Materno !== "" ? Apellido_Materno : null,
          nombres: Nombre ? Nombre : Nombres !== "" ? Nombres : null,
          nombres_completos: `${Paterno ? Paterno : Apellido_Paterno} ${Materno ? Materno : Apellido_Materno} ${Nombre ? Nombre : Nombres}`,
          f_nacimiento: Fecha_Nacimiento || null,
          sexo: Sexo || null,
          direccion: Direccion || null,
          departamento: Departamento_Domicilio || null,
          provincia: Provincia_Domicilio || null,
          distrito: Distrito_Domicilio || null,
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
