const { Storage } = require("@google-cloud/storage");
const https = require("https");
const path = require("path");
const fetch = require("node-fetch");
const fs = require("fs");
const { BUCKET_NAME } = require("../config");

const gc = new Storage({
  keyFilename: path.join(__dirname, "../../lerietmall-be9efc3ee5d7.json"),
  projectId: "lerietmall",
});

const httpAgent = new https.Agent({ rejectUnauthorized: false });

const dniHandler = {
  token: {
    operationName: "createToken",
    variables: { email: "benjy01278@gmail.com", password: "Benja271999" },
    query: `query createToken($email: String!, $password: String!)
      {login(email: $email, password: $password) {authentication}}`,
  },
  dniSave: (numdoc) => {
    return {
      operationName: "consultarDni",
      variables: { dni: numdoc },
      query: "query consultarDni($dni: String!) {dniPremium(dni: $dni) {data}}",
    };
  },
  operation: async (params = {}, token = undefined) => {
    try {
      let pending = await fetch(
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
        if (params.operationName == "createToken") {
          return e.data.login.authentication;
        } else {
          return e.data.dniPremium.data.result;
        }
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
  }) => {
    return {
      DNI: DNI,
      DIGITO: DigitoVerificacion,
      APELLIDO_PATERNO: Paterno,
      APELLIDO_MATERNO: Materno,
      NOMBRES: Nombre,
      NOMBRES_COMPLETOS: Paterno + " " + Materno + " " + Nombre,
      F_NACIMIENTO: FechaNacimiento,
      SEXO: Sexo,
      DIRECCION: Direccion,
      DEPARTAMENTO: Departamento,
      PROVINCIA: Provincia,
      DISTRITO: Distrito,
    };
  },
};

module.exports = {
  imageSave: async (filename, urlPublic) => {
    await gc.bucket(BUCKET_NAME).upload(filename, {
      destination: urlPublic,
      gzip: true,
      metadata: {
        cacheContro: "no-cache",
      },
    });
    try {
      fs.unlinkSync(filename);
    } catch (err) {
      const error = new Error();
      error.status = 500;
      error.message = "Internal server error";
      throw error;
    }
  },
  getDni: async (dni) => {
    return await dniHandler
      .operation(dniHandler.token)
      .then(async (token) => {
        return await dniHandler.operation(dniHandler.dniSave(dni), token);
      })
      .then(async (data) => {
        return dniHandler.result(data);
      })
      .catch((error) => new Error(error));
  },
};
