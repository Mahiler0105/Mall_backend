const https = require("https");
const fetch = require("node-fetch");

const httpAgent = new https.Agent({ rejectUnauthorized: false });

const dniHandler = {
  token: {
    operationName: "createToken",
    variables: { email: "benjy01278@gmail.com", password: "Benja271999" },
    query: `query createToken($email: String!, $password: String!)
        {login(email: $email, password: $password) {authentication}}`,
  },
  dniSave: (numdoc) => ({
    operationName: "consultarDni",
    variables: { dni: numdoc },
    query: "query consultarDni($dni: String!) {dniPremium(dni: $dni) {data}}",
  }),
  operation: async (params = {}, token = undefined) => {
    try {
      const pending = await fetch(
        "https://apiapp.aplicativoscontables.pe:3006/api",
        {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          agent: httpAgent,
        },
      );
      // return await pending.json();
      return await pending.json().then(async (e) => {
        if (params.operationName === "createToken") {
          return e.data.login.authentication;
        }
        return e.data.dniPremium.data.result;
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  },
  result: ({
    DNI,
    Paterno,
    Nombre,
    FechaNacimiento,
    Sexo,
    Materno,
    DigitoVerificacion,
    Departamento,
    Provincia,
    Distrito,
    Direccion,
  }) => ({
    DNI,
    DIGITO: DigitoVerificacion,
    APELLIDO_PATERNO: Paterno,
    APELLIDO_MATERNO: Materno,
    NOMBRES: Nombre,
    NOMBRES_COMPLETOS: `${Paterno} ${Materno} ${Nombre}`,
    F_NACIMIENTO: FechaNacimiento,
    SEXO: Sexo,
    DIRECCION: Direccion,
    DEPARTAMENTO: Departamento,
    PROVINCIA: Provincia,
    DISTRITO: Distrito,
  }),
};

module.exports = async (dni) => dniHandler
  .operation(dniHandler.token)
  .then(async (token) => dniHandler.operation(dniHandler.dniSave(dni), token))
  .then(async (data) => dniHandler.result(data))
  .catch((error) => new Error(error));
