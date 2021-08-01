const { genSaltSync, hashSync } = require("bcryptjs");
const moment = require("moment");
const { generateToken, decodeToken, adminToken } = require("../helpers/jwt.helper");
const { GetDNI, GetRUC, SendEmail, GetFacebookId, GetCurrency } = require("../helpers");

const { JWT_SECRET } = require("../config");

const puppeteer = require("puppeteer");

let _businessRepository = null;
let _customerRepository = null;
let _historyRepository = null;
let _documentHistory = null;
let _membershipRepository = null;

class AuthService {
     constructor({ BusinessRepository, CustomerRepository, HistoryRepository, DocumentRepository, MembershipRepository }) {
          _businessRepository = BusinessRepository;
          _customerRepository = CustomerRepository;
          _historyRepository = HistoryRepository;
          _documentHistory = DocumentRepository;
          _membershipRepository = MembershipRepository;
     }

     /**
      *
      * @param {*} business
      */
     async signUpBusiness(business) {
          const { email, source, token: jwt, ruc } = business;
          const error = new Error();

          if (!ruc) {
               error.status = 400;
               error.message = "RUC must be send";
               throw error;
          }
          const rucexist = await _documentHistory.getByRUC(ruc);
          if (!rucexist) {
               error.status = 400;
               error.message = "Imposible to proceed";
               throw error;
          }

          const businessExist = await _businessRepository.getBusinessByEmail(email);
          if (businessExist) {
               error.status = 400;
               error.message = "Business already exists";
               throw error;
          }

          const businessEntity = business;
          // delete businessEntity.source;

          if (!!source && source !== "email") {
               const saltSource = genSaltSync(10);
               if (source === "facebook") {
                    const { id } = await GetFacebookId(jwt);

                    if (id) businessEntity.password = hashSync(id, saltSource);
                    else {
                         error.status = 400;
                         error.message = "Invalid token";
                         throw error;
                    }
               } else {
                    const payload = decodeToken(jwt);
                    if (payload.sub) businessEntity.password = hashSync(payload.sub, saltSource);
                    else {
                         error.status = 400;
                         error.message = "Invalid token";
                         throw error;
                    }
               }
          }
          const {
               denomination,
               person: { dni, doc_number, name: person_name },
          } = rucexist;

          if (businessEntity.businessType === 2) businessEntity.name = denomination;
          businessEntity.owner.name = person_name;

          if (dni) businessEntity.owner.dni = dni;
          else if (doc_number) businessEntity.owner.dni = doc_number;

          const businessCreated = await _businessRepository.create(businessEntity);
          const salt = genSaltSync(5);
          const hashedPassowrd = hashSync(`${JWT_SECRET}${businessCreated._id}`, salt);
          // const keyReset = Buffer.from(hashedPassowrd).toString("base64");

          const entityToEncode = {
               id: businessCreated._id,
               email,
               rol: "business",
          };
          const token = generateToken(entityToEncode);
          const keyReset = Buffer.from(`${hashedPassowrd}|${token}`).toString("base64");

          if (source === "email") {
               await SendEmail(businessCreated.email, "Verificación de contraseña", "confirm", {
                    endpoint: `setpassword/${keyReset}/${businessCreated._id}/1`,
                    name: businessCreated.name.toUpperCase(),
               });
          } else {
               const cryptSource = Buffer.from(source).toString("base64");
               await SendEmail(businessCreated.email, "Confirmación cuenta", "confirm", {
                    endpoint: `oauth/confirm/${keyReset}/${businessCreated._id}/1/${cryptSource}`,
                    name: businessCreated.name.toUpperCase(),
               });
          }
          await _businessRepository.update(businessCreated._id, {
               urlConfirm: { url: keyReset, created: new Date() },
          });
          return businessCreated;
     }
     /**
      *
      * @param {*} customer
      */
     async signUpCustomer(customer) {
          const { email, source, token: jwt } = customer;
          const customerExist = await _customerRepository.getCustomerByEmail(email);
          const error = new Error();
          if (customerExist) {
               error.status = 400;
               error.message = "Customer already exists";
               throw error;
          }
          const customerEntity = customer;
          // delete customerEntity.source;
          if (!!source && source !== "email") {
               const saltSource = genSaltSync(10);
               if (source === "facebook") {
                    const { id } = await GetFacebookId(jwt);

                    if (id) customerEntity.password = hashSync(id, saltSource);
                    else {
                         error.status = 400;
                         error.message = "Invalid token";
                         throw error;
                    }
               } else {
                    const payload = decodeToken(jwt);
                    if (payload.sub) customerEntity.password = hashSync(payload.sub, saltSource);
                    else {
                         error.status = 400;
                         error.message = "Invalid token";
                         throw error;
                    }
               }
          }
          const customerCreated = await _customerRepository.create(customerEntity);
          const salt = genSaltSync(5);
          const hashedPassowrd = hashSync(`${JWT_SECRET}${customerCreated._id}`, salt);
          // const keyReset = Buffer.from(hashedPassowrd).toString("base64");

          const entityToEncode = {
               id: customerCreated._id,
               email,
               rol: "customer",
          };
          const token = generateToken(entityToEncode);
          const keyReset = Buffer.from(`${hashedPassowrd}|${token}`).toString("base64");

          if (source === "email") {
               await SendEmail(customerCreated.email, "Verificación de contraseña", "confirm", {
                    endpoint: `setpassword/${keyReset}/${customerCreated._id}/0`,
                    name: customerCreated.name.toUpperCase(),
               });
          } else {
               const cryptSource = Buffer.from(source).toString("base64");
               await SendEmail(customerCreated.email, "Confirmación de cuenta", "confirm", {
                    endpoint: `oauth/confirm/${keyReset}/${customerCreated._id}/0/${cryptSource}`,
                    name: customerCreated.name.toUpperCase(),
               });
          }
          await _customerRepository.update(customerCreated._id, {
               urlConfirm: { url: keyReset, created: new Date() },
          });
          return customerCreated;
     }

     async signInOauth(entity) {
          const { email, password, token: jwt } = entity;
          let accessEntity;
          let emailEntity = email;
          let entityRol = "business";
          if (!email && !password) {
               const payload = decodeToken(jwt);
               if (payload.iss.includes("google")) emailEntity = payload.email;
               else emailEntity = payload.preferred_username;
               accessEntity = payload.sub;
          }
          if (email && !password) {
               const { id } = await GetFacebookId(jwt);
               accessEntity = id;
          }
          let entityLogin = await _businessRepository.getBusinessByEmail(emailEntity);
          if (!entityLogin) {
               entityLogin = await _customerRepository.getCustomerByEmail(emailEntity);
               entityRol = "customer";
          }

          const error = new Error();
          if (!entityLogin || entityLogin?.inactive?.reason) {
               error.message = "Entity does not exist";
               error.status = 404;
               throw error;
          }
          if (entityLogin.urlConfirm.url) {
               error.message = "Account not confirmed yet";
               error.status = 400;
               throw error;
          }
          const validPassword = entityLogin.comparePasswords(password || accessEntity);
          if (!validPassword) {
               error.message = password ? "Invalid Password" : "Account does not exist";
               error.status = 400;
               throw error;
          }

          const entityToEncode = {
               id: entityLogin._id,
               email: entityLogin.email,
               rol: entityRol,
          };
          var payout = {};
          if (entityRol === "business") {
               const _member = await _membershipRepository.byClient(entityLogin._id);
               var must_pay, admin;
               var posted;

               if (_member.length === 0) {
                    admin = false;
               } else if (_member.length === 1) {
                    must_pay = _member[0].must_pay;
                    admin = entityLogin.admin === "authorized";
               } else {
                    error.message = "An error occurred while signing";
                    error.status = 500;
                    throw error;
               }
               payout.admin = admin;
               if (must_pay != undefined) payout.must_pay = must_pay;
               posted = entityLogin.active;
               entityLogin = entityLogin.toJSON();
               entityLogin = { ...entityLogin, posted };
          }
          const token = generateToken(entityToEncode);
          return { token, [entityRol]: entityLogin, payout };
     }

     eval_dni(result) {
          const { dni, digito, apellido_paterno, apellido_materno, nombres, f_nacimiento, sexo, direccion, departamento, provincia, distrito } =
               result;
          if (
               !dni ||
               !digito ||
               !apellido_paterno ||
               !apellido_materno ||
               !nombres ||
               !f_nacimiento ||
               !sexo ||
               !direccion ||
               !departamento ||
               !provincia ||
               !distrito
          )
               return false;
          return true;
     }
     async getDni(dni, withData = false) {
          const error = new Error();
          error.status = 400;
          error.message = "Not found";
          const dniexists = await _documentHistory.getByDNI(dni);
          if (dniexists) return true;

          const _dni = await GetDNI(dni);
          if (!_dni) throw error;

          const _eval = this.eval_dni(_dni);
          if (_eval) await _documentHistory.create({ ..._dni, type: "dni" });

          if (withData) return { success: _eval, ..._dni };
          return _eval;
     }

     async getRuc(ruc) {
          const error = new Error();

          const rucexist = await _documentHistory.getByRUC(ruc);
          if (rucexist) return true;

          const _ruc = await GetRUC(ruc);
          if (!_ruc) {
               error.status = 400;
               error.message = "Not found";
               throw error;
          }

          const { condition, status } = _ruc;
          if (condition === "HABIDO" && status === "ACTIVO") {
               await _documentHistory.create({ ..._ruc, type: "ruc" });
               return true;
          }
          error.status = 400;
          error.message = "RUC not active";
          throw error;
     }

     async updateCurrency(entity) {
          const _currencyexists = await _documentHistory.getByCurrency("USD");
          if (_currencyexists) {
               const { full } = _currencyexists;
               if (moment(full).format("YYYY-MM-DD") != moment().format("YYYY-MM-DD")) {
                    const _currency = await GetCurrency(entity);
                    if (_currency.success) return await _documentHistory.update(_currencyexists._id, { ..._currency });
               }
               return _currencyexists;
          }
          const _currency = await GetCurrency(entity);
          if (_currency.success) return await _documentHistory.create({ ..._currency, currency: "USD", type: "currency" });
          return false;
     }
     async getCurrency() {
          const _currencyexists = await _documentHistory.getByCurrency("USD");
          if (_currencyexists) return _currencyexists;
          return false;
     }

     async forgotPassword(email) {
          const businessExists = await _businessRepository.getBusinessByEmail(email);
          const customerExists = await _customerRepository.getCustomerByEmail(email);
          if (!businessExists && !customerExists) {
               const error = new Error();
               error.status = 403;
               error.message = "User does not found";
               throw error;
          }
          if ((businessExists && businessExists.urlReset.url !== "") || (customerExists && customerExists.urlReset.url !== "")) {
               const error = new Error();
               error.status = 400;
               error.message = "Already exists key email";
               throw error;
          }
          if ((businessExists && businessExists.source !== "email") || (customerExists && customerExists.source !== "email")) {
               const error = new Error();
               error.status = 405;
               error.message = "You do not have permissions";
               throw error;
          }
          const salt = genSaltSync(5);
          const id = businessExists ? businessExists._id : customerExists._id;
          const hashedPassowrd = hashSync(`${JWT_SECRET}${id}`, salt);

          const entityToEncode = {
               id,
               email,
               rol: businessExists ? "business" : "customer",
          };
          const token = generateToken(entityToEncode);

          const keyReset = Buffer.from(`${hashedPassowrd}|${token}`).toString("base64");
          const responseEmail = await SendEmail(email, "LERIETMALL: Recuperación de contraseña", "reset", {
               endpoint: `changepassword/${keyReset}/${businessExists ? businessExists._id : customerExists._id}/${businessExists ? 1 : 0}`,
               name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
          });
          if (businessExists) {
               await _businessRepository.update(businessExists._id, {
                    urlReset: { url: keyReset, created: new Date() },
               });
          } else {
               await _customerRepository.update(customerExists._id, {
                    urlReset: { url: keyReset, created: new Date() },
               });
          }
          return responseEmail;
     }

     async validateKey(id, key, rol) {
          const error = new Error();
          let businessExists;
          let customerExists;
          var field = "urlReset";
          if (rol === "0") {
               customerExists = await _customerRepository.get(id);
               if (!customerExists) {
                    error.status = 404;
                    error.message = "User does not found";
                    throw error;
               }
               if (customerExists.urlConfirm?.url) field = "urlConfirm";

               if (customerExists[field].url !== key) return false;
               return true;
          }
          if (rol === "1") {
               businessExists = await _businessRepository.get(id);
               if (!businessExists) {
                    error.status = 404;
                    error.message = "User does not found";
                    throw error;
               }
               if (businessExists.urlConfirm?.url) field = "urlConfirm";

               if (businessExists[field].url !== key) return false;
               return true;
          }
          error.status = 500;
          error.message = "Invalid keys";
          throw error;
     }

     async validateUser(email) {
          const business = await _businessRepository.getBusinessByEmail(email);
          const customer = await _customerRepository.getCustomerByEmail(email);
          if (business || customer) return true;
          return false;
     }

     async confirmOauth(params) {
          const { rsp, nst, knc, nfr, mth, vng, lgn, nbl, dsr, id } = params;
          const businessExists = await _businessRepository.get(id);
          const customerExists = await _customerRepository.get(id);
          if (!customerExists && !businessExists) return false;

          // const _data = { urlConfirm: { url: "", created: new Date() } };
          const _data = "urlConfirm";
          let _token;
          if (rsp && nst && knc && nfr && mth && vng && lgn && nbl && dsr) {
               _token = String(rsp).concat(nst, knc, nfr, mth, vng, lgn, nbl, dsr);
               if (_token.split(".").length === 3) {
                    try {
                         const payload = decodeToken(_token);
                         if (payload.sub) {
                              let _result;
                              // if (customerExists) _result = _customerRepository.update(id, _data);
                              // else _result = _businessRepository.update(id, _data);
                              if (customerExists) _result = _customerRepository.deleteField(id, _data);
                              else _result = _businessRepository.deleteField(id, _data);
                              if (!_result) return false;
                              return true;
                         }
                    } catch (error) {
                         return false;
                    }
               } else {
                    const { id: idw } = await GetFacebookId(_token);
                    if (idw) {
                         let _result;
                         // if (customerExists) _result = _customerRepository.update(id, _data);
                         // else _result = _businessRepository.update(id, _data);
                         if (customerExists) _result = _customerRepository.deleteField(id, _data);
                         else _result = _businessRepository.deleteField(id, _data);
                         if (!_result) return false;
                         return true;
                    }
                    return false;
               }
          }
          return false;
     }

     async deleteKeys() {
          const businesses = await _businessRepository.getAll();
          const customers = await _customerRepository.getAll();

          businesses.map(async (key) => {
               if (moment().diff(key.urlReset.created, "hours") >= 4) {
                    await _businessRepository.update(key._id, {
                         urlReset: { url: "", created: new Date() },
                    });
               }
               if (moment().diff(key.codeVerification.created, "minutes") >= 5) {
                    await _businessRepository.update(key._id, {
                         codeVerification: { code: "", created: new Date() },
                    });
               }
               if (!!key.urlConfirm?.url) {
                    if (moment().diff(key.urlConfirm.created, "hours") >= 4) {
                         await _historyRepository.create({ ...key, type: "business-not-confirmed" });
                         await _businessRepository.delete(key._id);
                    }
               }
               if (!!key.inactive?.created) {
                    if (moment().diff(key.inactive.created, "days") === 7 && !key.inactive.seven_days) {
                         await SendEmail(key.email, "LERIETMALL: Aviso desactivación de cuenta", "default", {
                              title_1: "Desactivación",
                              title_2: "de cuenta",
                              name: key.name.toUpperCase(),
                              message: "le recordamos que aun estas a tiempo de activar tu cuenta, te quedan 7 dias. Atte. equipo de Lerietmall",
                         });
                         var inactive = key.inactive;
                         inactive.seven_days = true;
                         await _businessRepository.update(key._id, { inactive });
                    }
                    if (moment().diff(key.inactive.created, "days") === 15) {
                         await _businessRepository.delete(key._id);
                         await SendEmail(key.email, "LERIETMALL: Aviso", "default", {
                              title_1: "Tu cuenta ha sido",
                              title_2: "eliminada",
                              name: key.name.toUpperCase(),
                              message: "lamentamos que te hayas ido. Atte. equipo de Lerietmall",
                         });
                    }
               }
          });
          customers.map(async (key) => {
               if (moment().diff(key.urlReset.created, "hours") >= 4) {
                    await _customerRepository.update(key._id, {
                         urlReset: { url: "", created: new Date() },
                    });
               }
               if (moment().diff(key.codeVerification.created, "minutes") >= 5) {
                    await _customerRepository.update(key._id, {
                         codeVerification: { code: "", created: new Date() },
                    });
               }
               if (!!key.urlConfirm?.url) {
                    if (moment().diff(key.urlConfirm.created, "hours") >= 4) {
                         await _historyRepository.create({ ...key, type: "customer-not-confirmed" });
                         await _customerRepository.delete(key._id);
                    }
               }
               if (!!key.inactive?.created) {
                    if (moment().diff(key.inactive.created, "days") === 7 && !key.inactive.seven_days) {
                         await SendEmail(key.email, "LERIETMALL: Aviso desactivación de cuenta", "default", {
                              title_1: "Desactivación",
                              title_2: "de cuenta",
                              name: key.name.toUpperCase(),
                              message: "le recordamos que aun estas a tiempo de activar tu cuenta, te quedan 7 dias. Atte. equipo de Lerietmall",
                         });
                         var inactive = key.inactive;
                         inactive.seven_days = true;
                         await _customerRepository.update(key._id, { inactive });
                    }
                    if (moment().diff(key.inactive.created, "days") === 15) {
                         await _customerRepository.delete(key._id);
                         await SendEmail(key.email, "LERIETMALL: Aviso", "default", {
                              title_1: "Tu cuenta ha sido",
                              title_2: "eliminada",
                              name: key.name.toUpperCase(),
                              message: "lamentamos que te hayas ido, gracias por tu tiempo en la plataforma. Atte. equipo de Lerietmall",
                         });
                    }
               }
          });
          return true;
     }

     async verifyPassword(id, { old_password: oldPassword, new_password: newPassword }) {
          const error = new Error();
          if (!oldPassword || !newPassword) {
               error.status = 400;
               error.message = "Arguments does not found";
               throw error;
          }
          const businessExists = await _businessRepository.get(id);
          const customerExists = await _customerRepository.get(id);
          if (!businessExists && !customerExists) {
               error.status = 403;
               error.message = "User does not found";
               throw error;
          }
          if (businessExists?.comparePasswords(oldPassword) || customerExists?.comparePasswords(oldPassword)) {
               if (businessExists) await _businessRepository.update(id, { password: newPassword });
               else await _customerRepository.update(id, { password: newPassword });
               return SendEmail(
                    businessExists ? businessExists.email : customerExists.email,
                    "LERIETMALL: Tu contraseña ha sido cambiada",
                    "change_pass",
                    {
                         name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
                    }
               );
          }
          return false;
     }

     async changeEmail({ email }) {
          const error = new Error();
          if (!email) {
               error.status = 404;
               error.message = "Email does not found";
               throw error;
          }
          const businessExists = await _businessRepository.getBusinessByEmail(email);
          const customerExists = await _customerRepository.getCustomerByEmail(email);
          if (!businessExists && !customerExists) {
               error.status = 400;
               error.message = "User does not found";
               throw error;
          }
          if (businessExists?.codeVerification?.code || customerExists?.codeVerification?.code) {
               error.status = 400;
               error.message = "Code already exists";
               throw error;
          }
          const codeVerification = Math.random().toString(36).substr(2, 6).toUpperCase();
          if (businessExists)
               await _businessRepository.update(businessExists._id, { codeVerification: { code: codeVerification, created: new Date() } });
          else await _customerRepository.update(customerExists.id, { codeVerification: { code: codeVerification, created: new Date() } });
          return SendEmail(businessExists ? businessExists.email : customerExists.email, "LERIETMALL: CODIGO de confirmación", "change_email", {
               name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
               code_verification: codeVerification,
          });
     }

     async verifyCodeEmail({ code, email }) {
          const error = new Error();
          if (!code || !email) {
               error.status = 400;
               error.message = "Arguments does not found";
               throw error;
          }
          const businessExists = await _businessRepository.getBusinessByEmail(email);
          const customerExists = await _customerRepository.getCustomerByEmail(email);
          if (!businessExists && !customerExists) {
               error.status = 404;
               error.message = "User does not found";
               throw error;
          }
          return businessExists?.codeVerification?.code === code || customerExists?.codeVerification?.code === code;
     }

     async validateRandD(code, idUser, jwt) {
          const error = new Error();
          if (!idUser) {
               error.status = 400;
               error.message = "ID must be sent";
               throw error;
          }
          const businessExists = await _businessRepository.get(idUser);
          const customerExists = await _customerRepository.get(idUser);
          if (!customerExists && !businessExists) {
               error.status = 400;
               error.message = "User does not found";
               throw error;
          }
          if (jwt) {
               if (customerExists?._id.toString() !== jwt?.id && businessExists?._id.toString() !== jwt?.id) {
                    error.status = 400;
                    error.message = "Don't have permissions";
                    throw error;
               }
          }
          if (customerExists?.codeVerification?.code !== code && businessExists?.codeVerification?.code !== code) {
               return { success: false };
          }
          return { success: true, users: { businessExists, customerExists } };
     }

     async reactivate({ code }, email, jwt) {
          const error = new Error();
          if (!email && !code) {
               error.status = 400;
               error.message = "Invalid parameters";
               throw error;
          }
          const businessExists = await _businessRepository.getBusinessByEmail(email);
          const customerExists = await _customerRepository.getCustomerByEmail(email);
          if (!customerExists && !businessExists) {
               error.status = 400;
               error.message = "User does not found";
               throw error;
          }
          if (!businessExists?.inactive?.reason && !customerExists?.inactive?.reason) {
               error.status = 500;
               error.message = "Your account is active";
               throw error;
          }
          if (customerExists) await _customerRepository.deleteField(customerExists._id, "inactive");
          else await _businessRepository.deleteField(businessExists._id, "inactive");
          await SendEmail(businessExists ? businessExists.email : customerExists.email, "LERIETMALL: Activación de cuenta", "default", {
               title_1: "Activación",
               title_2: "de cuenta",
               name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
               message: "nos da gusto que vuelvas a estar con nosotros, no olvides que tienes una forma facil de comunicarte con nosotros, atte equipo Lerietmall.",
          });
          return true;
     }

     async deactivate({ code, reason }, idUser, jwt) {
          const { success, users } = await this.validateRandD(code, idUser, jwt);
          if (!success) return false;
          const { businessExists, customerExists } = users;
          console.log(users);
          if (customerExists) await _customerRepository.update(idUser, { inactive: { created: new Date(), reason, seven_days: false } });
          else await _businessRepository.update(idUser, { inactive: { created: new Date(), reason, seven_days: false } });
          await SendEmail(businessExists ? businessExists.email : customerExists.email, "LERIETMALL: Desactivación de cuenta", "default", {
               title_1: "Desactivación",
               title_2: "de cuenta",
               name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
               message: "Tiene 15 días para volver a activarla sino la cuenta se eliminará indefinidamente.",
          });
          return true;
     }

     async key(entity) {
          var data = {};
          const { id, dni, ruc, email } = entity;
          if (id) data.id = id;
          if (dni) data.dni = dni;
          if (ruc) data.ruc = ruc;
          if (email) data.email = email;

          return { token: adminToken(data) };
     }

     async autorecursive() {
          const SORTER = await _documentHistory.getBySorter();
          var SEARCH = null;
          if (SORTER) {
               const { value } = SORTER;
               const LAST_DNI = parseInt(value);
               var AUMENTED_DNI = LAST_DNI + 1;
               AUMENTED_DNI = String(AUMENTED_DNI).padStart(8, "0");
               await _documentHistory.update(SORTER._id, { value: AUMENTED_DNI });
               SEARCH = AUMENTED_DNI;
          } else {
               var INI = "00000000";
               await _documentHistory.create({ value: INI, type: "sorter" });
               SEARCH = INI;
          }
          // return SEARCH;
          const DNI = await this.getDni(SEARCH, true);
          const SUCCESS = DNI.success;

          return SUCCESS;
     }
     async autofill(entity) {
          console.log(entity);
          await _documentHistory.create({ ruc: entity.ruc, token: entity.token, type: "sorter" }).catch((err)=>console.log(err));
     }
     async sunat(entity) {
          if (String(entity).length === 11) {
               const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
               const page = await browser.newPage();
               await page.goto(`https://lerit-admin-qmxvc2akkq-ue.a.run.app/v1/api/lerietmall/ruc?ruc=${entity}`);

               return true;
          }
          return false;
     }
}

module.exports = AuthService;
