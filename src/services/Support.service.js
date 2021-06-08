const moment = require("moment");
import { Support } from "../helpers";

let _businessRepository = null;
let _customerRepository = null;
let _supportRepository = null;
let _documentRepository = null;
let _authService = null;

function _err(m) {
     const error = new Error();
     error.status = 500;
     error.message = m;
     throw error;
}

class SupportService {
     constructor({ BusinessRepository, CustomerRepository, SupportRepository, DocumentRepository, AuthService }) {
          _businessRepository = BusinessRepository;
          _customerRepository = CustomerRepository;
          _supportRepository = SupportRepository;
          _documentRepository = DocumentRepository;
          _authService = AuthService;

          this.business = null;
     }

     async listRequest(entity) {
          const { ruc, id, email } = entity;
          if (!ruc && !id && !email) _err("Please send required parameters");

          const businessExists = await _businessRepository.get(id);
          if (!businessExists) _err("Business does not exist");

          const { ruc: _r, email: _e } = businessExists;
          if (_r != ruc || _e != email) _err("Invalid business");

          return await _supportRepository.list(businessExists._id);
     }

     async searchRequest(entity) {
          const _entity = Object.assign({}, entity);
          const vars = ["code", "idBusiness", "idClient", "status", "seen"];
          vars.map((x) => delete entity[x]);
          if (Object.keys(entity).length > 0) _err("Invalid parameters");

          const { idBusiness, idClient } = _entity;
          if (!idBusiness && !idClient) _err("User must be send");

          var _get = idClient ? idClient : idBusiness ? idBusiness : null;
          var _user = await _businessRepository.get(_get);

          if (!_user) _err("User does not exist");

          return await _supportRepository.search(_entity);
     }

     async createRequest(entity) {
          const { ruc, id, email, code, variables } = entity;
          if (!ruc && !id && !email && !code) _err("Please send required parameters");

          const businessExists = await _businessRepository.get(id);
          if (!businessExists) _err("Business does not exist");

          const { ruc: _r, email: _e } = businessExists;
          if (_r != ruc || _e != email) _err("Invalid business");

          this.business = businessExists;

          const valid_code = Support.codesDictionary[code];
          if (!valid_code) _err("Invalid code");

          if (valid_code.external_verification) {
               const support_ticket = await _supportRepository.create({
                    code,
                    idBusiness: businessExists._id,
                    variables: JSON.stringify(variables),
               });
               if (!support_ticket) _err("Not created");
               return true;
          } else return await this[valid_code.method](variables);
     }

     async fillDniOwner(entity) {
          if (!entity) _err("Invalid parameters");
          const { dni: dni_send, phone } = entity;
          if (!dni_send) _err("DNI must be sent to this operation");

          const { owner, ruc } = this.business;
          if (!owner) _err("A structure must be updated");

          const { dni } = owner;
          if (!dni) {
               const ruc_store = await _documentRepository.getByRUC(ruc);
               if (!ruc_store) _err("Ruc not found");
               const {
                    ruc: type_ruc,
                    person: { dni: dni_natural_person, doc_number: dni_juridic_person },
               } = ruc_store;

               var _compare_dni = type_ruc.startsWith("2") ? dni_juridic_person : dni_natural_person;

               if (_compare_dni != dni_send) _err("Incorrect dni");
          } else {
               if (dni != dni_send) _err("Incorrect dni");
          }

          const _dnicreated = await _authService.getDni(dni_send);
          if (_dnicreated) {
               const dni_store = await _documentRepository.getByDNI(dni_send);
               if (!dni_store) return false;

               const { dni: _dni, nombres: name, apellido_paterno: first_lname, apellido_materno: second_lname, sexo } = dni_store;
               var _owner = {
                    dni: _dni,
                    name,
                    first_lname,
                    second_lname,
                    sex: sexo === "MASCULINO",
                    phone: phone || "000000000",
               };
               await _businessRepository.update(this.business._id, { owner: _owner });
               return true;
          }
          return false;
     }
}

module.exports = SupportService;
