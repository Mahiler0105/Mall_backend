"use strict";

const {
  genSaltSync,
  hashSync
} = require('bcryptjs');

const moment = require('moment');

const {
  generateToken,
  decodeToken
} = require('../helpers/jwt.helper');

const {
  GetDNI,
  GetRUC,
  SendEmail,
  GetFacebookId
} = require('../helpers');

const {
  JWT_SECRET
} = require('../config');

let _businessRepository = null;
let _customerRepository = null;

class AuthService {
  constructor({
    BusinessRepository,
    CustomerRepository
  }) {
    _businessRepository = BusinessRepository;
    _customerRepository = CustomerRepository;
  }
  /**
   *
   * @param {*} business
   */


  async signUpBusiness(business) {
    const {
      email,
      source,
      token: jwt
    } = business;
    const businessExist = await _businessRepository.getBusinessByEmail(email);
    const error = new Error();

    if (businessExist) {
      error.status = 400;
      error.message = 'Business already exists';
      throw error;
    } else {
      const businessEntity = business; // delete businessEntity.source;

      if (source !== 'email') {
        const saltSource = genSaltSync(10);

        if (source === 'facebook') {
          const {
            id
          } = await GetFacebookId(jwt);
          if (id) businessEntity.password = hashSync(id, saltSource);else {
            error.status = 400;
            error.message = 'Invalid token';
            throw error;
          }
        } else {
          const payload = decodeToken(jwt);
          if (payload.sub) businessEntity.password = hashSync(payload.sub, saltSource);else {
            error.status = 400;
            error.message = 'Invalid token';
            throw error;
          }
        }
      }

      const businessCreated = await _businessRepository.create(businessEntity);
      const salt = genSaltSync(5);
      const hashedPassowrd = hashSync(`${JWT_SECRET}${businessCreated._id}`, salt);
      const keyReset = Buffer.from(hashedPassowrd).toString('base64');

      if (source === 'email') {
        await SendEmail(businessCreated.email, 'Verificación de contraseña', 'confirm', {
          endpoint: `setpassword/${keyReset}/${businessCreated._id}/1`,
          name: businessCreated.name.toUpperCase()
        });
      } else {
        const cryptSource = Buffer.from(source).toString('base64');
        await SendEmail(businessCreated.email, 'Confirmación cuenta', 'confirm', {
          endpoint: `oauth/confirm/${keyReset}/${businessCreated._id}/1/${cryptSource}`,
          name: businessCreated.name.toUpperCase()
        });
      }

      await _businessRepository.update(businessCreated._id, {
        urlReset: {
          url: keyReset,
          created: new Date()
        }
      });
      return businessCreated;
    }
  }
  /**
   *
   * @param {*} customer
   */


  async signUpCustomer(customer) {
    const {
      email,
      source,
      token: jwt
    } = customer;
    const customerExist = await _customerRepository.getCustomerByEmail(email);
    const error = new Error();

    if (customerExist) {
      error.status = 400;
      error.message = 'Customer already exists';
      throw error;
    } else {
      const customerEntity = customer; // delete customerEntity.source;

      if (source !== 'email') {
        const saltSource = genSaltSync(10);

        if (source === 'facebook') {
          const {
            id
          } = await GetFacebookId(jwt);
          if (id) customerEntity.password = hashSync(id, saltSource);else {
            error.status = 400;
            error.message = 'Invalid token';
            throw error;
          }
        } else {
          const payload = decodeToken(jwt);
          if (payload.sub) customerEntity.password = hashSync(payload.sub, saltSource);else {
            error.status = 400;
            error.message = 'Invalid token';
            throw error;
          }
        }
      }

      const customerCreated = await _customerRepository.create(customerEntity);
      const salt = genSaltSync(5);
      const hashedPassowrd = hashSync(`${JWT_SECRET}${customerCreated._id}`, salt);
      const keyReset = Buffer.from(hashedPassowrd).toString('base64');

      if (source === 'email') {
        await SendEmail(customerCreated.email, 'Verificación de contraseña', 'confirm', {
          endpoint: `setpassword/${keyReset}/${customerCreated._id}/0`,
          name: customerCreated.name.toUpperCase()
        });
      } else {
        const cryptSource = Buffer.from(source).toString('base64');
        await SendEmail(customerCreated.email, 'Confirmación de cuenta', 'confirm', {
          endpoint: `oauth/confirm/${keyReset}/${customerCreated._id}/0/${cryptSource}`,
          name: customerCreated.name.toUpperCase()
        });
      }

      await _customerRepository.update(customerCreated._id, {
        urlReset: {
          url: keyReset,
          created: new Date()
        }
      });
      return customerCreated;
    }
  }

  async signInOauth(entity) {
    const {
      email,
      password,
      token: jwt
    } = entity;
    let accessEntity;
    let emailEntity = email;
    let entityRol = 'business';

    if (!email && !password) {
      const payload = decodeToken(jwt);
      if (payload.iss.includes('google')) emailEntity = payload.email;else emailEntity = payload.preferred_username;
      accessEntity = payload.sub;
    }

    if (email && !password) {
      const {
        id
      } = await GetFacebookId(jwt);
      accessEntity = id;
    }

    let entityLogin = await _businessRepository.getBusinessByEmail(emailEntity);

    if (!entityLogin) {
      entityLogin = await _customerRepository.getCustomerByEmail(emailEntity);
      entityRol = 'customer';
    }

    const error = new Error();

    if (!entityLogin || entityLogin.disabled) {
      error.message = 'Entity does not exist';
      error.status = 404;
      throw error;
    }

    if (entityLogin.urlReset.url) {
      error.message = 'Account not confirmed yet';
      error.status = 400;
      throw error;
    }

    const validPassword = entityLogin.comparePasswords(password || accessEntity);

    if (!validPassword) {
      error.message = password ? 'Invalid Password' : 'Account does not exist';
      error.status = 400;
      throw error;
    }

    const entityToEncode = {
      id: entityLogin._id,
      email: entityLogin.email,
      rol: entityRol
    };
    const token = generateToken(entityToEncode);
    return {
      token,
      [entityRol]: entityLogin
    };
  }

  async getDni(dni) {
    return GetDNI(dni);
  }

  async getRuc(ruc) {
    return GetRUC(ruc);
  }

  async forgotPassword(email) {
    const businessExists = await _businessRepository.getBusinessByEmail(email);
    const customerExists = await _customerRepository.getCustomerByEmail(email);

    if (!businessExists && !customerExists) {
      const error = new Error();
      error.status = 403;
      error.message = 'User does not found';
      throw error;
    }

    if (businessExists && businessExists.urlReset.url !== '' || customerExists && customerExists.urlReset.url !== '') {
      const error = new Error();
      error.status = 400;
      error.message = 'Already exists key email';
      throw error;
    }

    if (businessExists && businessExists.source !== 'email' || customerExists && customerExists.source !== 'email') {
      const error = new Error();
      error.status = 400;
      error.message = 'You do not have permissions';
      throw error;
    }

    const salt = genSaltSync(5);
    const hashedPassowrd = hashSync(`${JWT_SECRET}${businessExists ? businessExists._id : customerExists._id}`, salt);
    const keyReset = Buffer.from(hashedPassowrd).toString('base64');
    const responseEmail = await SendEmail(email, 'LERIETMALL: Recuperación de contraseña', 'reset', {
      endpoint: `changepassword/${keyReset}/${businessExists ? businessExists._id : customerExists._id}/${businessExists ? 1 : 0}`,
      name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase()
    });

    if (businessExists) {
      await _businessRepository.update(businessExists._id, {
        urlReset: {
          url: keyReset,
          created: new Date()
        }
      });
    } else {
      await _customerRepository.update(customerExists._id, {
        urlReset: {
          url: keyReset,
          created: new Date()
        }
      });
    }

    return responseEmail;
  }

  async validateKey(id, key, rol) {
    const error = new Error();
    let businessExists;
    let customerExists;

    if (rol === '0') {
      customerExists = await _customerRepository.get(id);

      if (!customerExists) {
        error.status = 404;
        error.message = 'User does not found';
        throw error;
      }

      if (customerExists.urlReset.url !== key) return false;
      return true;
    }

    if (rol === '1') {
      businessExists = await _businessRepository.get(id);

      if (!businessExists) {
        error.status = 404;
        error.message = 'User does not found';
        throw error;
      }

      if (businessExists.urlReset.url !== key) return false;
      return true;
    }

    error.status = 500;
    error.message = 'Invalid keys';
    throw error;
  }

  async validateUser(email) {
    const business = await _businessRepository.getBusinessByEmail(email);
    const customer = await _customerRepository.getCustomerByEmail(email);
    if (business || customer) return true;
    return false;
  }

  async confirmOauth(params) {
    const {
      rsp,
      nst,
      knc,
      nfr,
      mth,
      vng,
      lgn,
      nbl,
      dsr,
      id
    } = params;
    const businessExists = await _businessRepository.get(id);
    const customerExists = await _customerRepository.get(id);
    if (!customerExists && !businessExists) return false;
    const _data = {
      urlReset: {
        url: '',
        created: new Date()
      }
    };

    let _token;

    if (rsp && nst && knc && nfr && mth && vng && lgn && nbl && dsr) {
      _token = String(rsp).concat(nst, knc, nfr, mth, vng, lgn, nbl, dsr);

      if (_token.split('.').length === 3) {
        try {
          const payload = decodeToken(_token);

          if (payload.sub) {
            let _result;

            if (customerExists) _result = _customerRepository.update(id, _data);else _result = _businessRepository.update(id, _data);
            if (!_result) return false;
            return true;
          }
        } catch (error) {
          return false;
        }
      } else {
        const {
          id: idw
        } = await GetFacebookId(_token);

        if (idw) {
          let _result;

          if (customerExists) _result = _customerRepository.update(id, _data);else _result = _businessRepository.update(id, _data);
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
    businesses.map(async key => {
      if (moment().diff(key.urlReset.created, 'hours') >= 4) {
        await _businessRepository.update(key._id, {
          urlReset: {
            url: '',
            created: new Date()
          }
        });
      }

      if (moment().diff(key.codeVerification.created, 'minutes') >= 5) {
        await _businessRepository.update(key._id, {
          codeVerification: {
            code: '',
            created: new Date()
          }
        });
      }
    });
    customers.map(async key => {
      if (moment().diff(key.urlReset.created, 'hours') >= 4) {
        await _customerRepository.update(key._id, {
          urlReset: {
            url: '',
            created: new Date()
          }
        });
      }

      if (moment().diff(key.codeVerification.created, 'minutes') >= 5) {
        await _customerRepository.update(key._id, {
          codeVerification: {
            code: '',
            created: new Date()
          }
        });
      }
    });
    return true;
  }

  async verifyPassword(id, {
    old_password: oldPassword,
    new_password: newPassword
  }) {
    const error = new Error();

    if (!oldPassword || !newPassword) {
      error.status = 400;
      error.message = 'Arguments does not found';
      throw error;
    }

    const businessExists = await _businessRepository.get(id);
    const customerExists = await _customerRepository.get(id);

    if (!businessExists && !customerExists) {
      error.status = 403;
      error.message = 'User does not found';
      throw error;
    }

    if (businessExists !== null && businessExists !== void 0 && businessExists.comparePasswords(oldPassword) || customerExists !== null && customerExists !== void 0 && customerExists.comparePasswords(oldPassword)) {
      if (businessExists) await _businessRepository.update(id, {
        password: newPassword
      });else await _customerRepository.update(id, {
        password: newPassword
      });
      return SendEmail(businessExists ? businessExists.email : customerExists.email, 'LERIETMALL: Tu contraseña ha sido cambiada', 'change_pass', {
        name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase()
      });
    }

    return false;
  }

  async changeEmail({
    email
  }) {
    var _businessExists$codeV, _customerExists$codeV;

    const error = new Error();

    if (!email) {
      error.status = 404;
      error.message = 'Email does not found';
      throw error;
    }

    const businessExists = await _businessRepository.getBusinessByEmail(email);
    const customerExists = await _customerRepository.getCustomerByEmail(email);

    if (!businessExists && !customerExists) {
      error.status = 400;
      error.message = 'User does not found';
      throw error;
    }

    if (businessExists !== null && businessExists !== void 0 && (_businessExists$codeV = businessExists.codeVerification) !== null && _businessExists$codeV !== void 0 && _businessExists$codeV.code || customerExists !== null && customerExists !== void 0 && (_customerExists$codeV = customerExists.codeVerification) !== null && _customerExists$codeV !== void 0 && _customerExists$codeV.code) {
      error.status = 400;
      error.message = 'Code already exists';
      throw error;
    }

    const codeVerification = Math.random().toString(36).substr(2, 6).toUpperCase();
    if (businessExists) await _businessRepository.update(businessExists._id, {
      codeVerification: {
        code: codeVerification,
        created: new Date()
      }
    });else await _customerRepository.update(customerExists.id, {
      codeVerification: {
        code: codeVerification,
        created: new Date()
      }
    });
    return SendEmail(businessExists ? businessExists.email : customerExists.email, 'LERIETMALL: CODIGO de confirmación', 'change_email', {
      name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
      code_verification: codeVerification
    });
  }

  async verifyCodeEmail({
    code,
    email
  }) {
    var _businessExists$codeV2, _customerExists$codeV2;

    const error = new Error();

    if (!code || !email) {
      error.status = 400;
      error.message = 'Arguments does not found';
      throw error;
    }

    const businessExists = await _businessRepository.getBusinessByEmail(email);
    const customerExists = await _customerRepository.getCustomerByEmail(email);

    if (!businessExists && !customerExists) {
      error.status = 404;
      error.message = 'User does not found';
      throw error;
    }

    return (businessExists === null || businessExists === void 0 ? void 0 : (_businessExists$codeV2 = businessExists.codeVerification) === null || _businessExists$codeV2 === void 0 ? void 0 : _businessExists$codeV2.code) === code || (customerExists === null || customerExists === void 0 ? void 0 : (_customerExists$codeV2 = customerExists.codeVerification) === null || _customerExists$codeV2 === void 0 ? void 0 : _customerExists$codeV2.code) === code;
  }

}

module.exports = AuthService;