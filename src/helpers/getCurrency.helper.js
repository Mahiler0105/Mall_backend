const https = require("https");
const fetch = require("node-fetch");
const moment = require("moment");
import { sign } from "jsonwebtoken";

const httpAgent = new https.Agent({ rejectUnauthorized: false });
const currencyHandler = {
     intoken: null,
     token: {
          operationName: "createToken",
          variables: { email: "benjy01278@gmail.com", password: "Benja271999" },
          query: `query createToken($email: String!, $password: String!)
              {login(email: $email, password: $password) {authentication}}`,
     },
     currencySave: (variables) => ({
          operationName: "consultarTipoCambio",
          variables,
          query: `query consultarTipoCambio(${variables.dia ? "$dia: String!," : ""} $mes: String!, $anio: String!) {tipoCambioSunat(${
               variables.dia ? "dia: $dia," : ""
          } mes: $mes, anio: $anio) {data}}`,
     }),
     operation: async (params = {}, token = undefined) => {
          try {
               var inset = { sub: "smartb" };
               if (params.operationName === "consultarTipoCambio") inset = { ...inset, pathname: "/aplicativos/tipocambio", tab: "periodo" };
               var isAuth = sign(inset, "b247ab672c1fe43cadb89c41a8dd3a6a4b32222bb5b97f5c7fcba815249a5e57", { expiresIn: "4h" });

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
                         currencyHandler.intoken = e.data.login.authentication;
                         return currencyHandler.intoken;
                    }
                    return e?.data?.tipoCambioSunat?.data?.result ? { data: e.data.tipoCambioSunat.data.result, entity: params.variables } : {};
               });
          } catch (e) {
               console.log(e);
               throw new Error(e);
          }
     },
     currentDate: (entity) => {
          if (entity) {
               const { anio, mes, dia } = entity;
               if (anio && mes && dia) return { anio, mes, dia };
               if (anio && mes) return { anio, mes };
          }
          const [anio, mes, dia] = moment().tz("America/Lima").subtract(1, "day").format("YYYY-MM-DD").split("-");
          return { anio, mes, dia };
     },
     changing: (compra, digits) => {
          return parseFloat(parseFloat(1 / parseFloat(compra)).toFixed(digits));
     },
     result: ({ data, entity }) => {
          if (data) {
               const { anio, mes, dia } = entity;
               var Compra, Venta;

               var day = dia;

               if (Array.isArray(data)) {
                    var row = data[0];
                    var keys = Object.keys(row);
                    var calc = keys.reduce((o, v) => {
                         var value = row[v];
                         if (!Array.isArray(value)) {
                              o.Compra = value.Compra;
                              o.Venta = value.Venta;
                              o.Dia = String(v).split("/")[0].padStart(2, "0");
                         }
                         return o;
                    }, {});
                    if (calc.Compra && calc.Venta) {
                         Compra = calc.Compra;
                         Venta = calc.Venta;
                    }
                    if (calc.Dia) day = calc.Dia;
               } else {
                    Compra = data.Compra;
                    Venta = data.Venta;
               }

               if (!day) day = moment().format("DD");

               if (Compra && Venta)
                    return {
                         success: true,
                         compra: parseFloat(Compra),
                         venta: parseFloat(Venta),
                         ...entity,
                         dia: day,
                         full: moment(`${anio}-${mes}-${day}`),
                         change_4: currencyHandler.changing(Compra, 4),
                         change_2: currencyHandler.changing(Compra, 2),
                    };
          }
          return { success: false, error: "Sin data" };
          // const error = new Error();
          // error.status = 500;
          // error.message = "Sin data";
          // throw error;
     },
     async evalFalse(data) {
          if (data.success) return data;
          const { anio, mes } = currencyHandler.currentDate();
          return currencyHandler.result(await currencyHandler.operation(currencyHandler.currencySave({ anio, mes }), currencyHandler.intoken));
     },
};
module.exports = async (entity) =>
     await currencyHandler
          .operation(currencyHandler.token)
          .then(async (token) => await currencyHandler.operation(currencyHandler.currencySave(currencyHandler.currentDate(entity)), token))
          .then(async (data) => currencyHandler.result(data))
          .then(async (data) => await currencyHandler.evalFalse(data));
// .catch((error) => {
//      console.log(error);
// });
