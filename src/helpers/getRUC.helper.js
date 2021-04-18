const https = require("https");
const fetch = require("node-fetch");

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
               const pending = await fetch("https://apiapp.aplicativoscontables.pe:3006/api", {
                    method: "POST",
                    body: JSON.stringify(params),
                    headers: {
                         "Content-Type": "application/json",
                         authentication: token,
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
};
module.exports = async (ruc) =>
     rucHandler
          .operation(rucHandler.token)
          .then(async (token) => rucHandler.operation(rucHandler.rucSave(ruc), token))
          // .then(async (data) => rucHandler.result(data))
          .catch((error) => new Error(error));
