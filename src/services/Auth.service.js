const { generateToken } = require("../helpers/jwt.helper");
const { GetDNI, SendEmail } = require("../helpers");
const { genSaltSync, hashSync } = require("bcryptjs");
const moment = require("moment");

const { JWT_SECRET } = require("../config");

let _businessRepository = null;
let _customerRepository = null;

class AuthService {
  constructor({ BusinessRepository, CustomerRepository }) {
    _businessRepository = BusinessRepository;
    _customerRepository = CustomerRepository;
  }

  /**
   *
   * @param {*} business
   */
  async signUpBusiness(business) {
    const { email } = business;
    const businessExist = await _businessRepository.getBusinessByEmail(email);
    if (businessExist) {
      const error = new Error();
      error.status = 400;
      error.message = "Business already exists";
      throw error;
    } else {
      let businessCreated = await _businessRepository.create(business);
      const salt = genSaltSync(5);
      const hashedPassowrd = hashSync(
        `${JWT_SECRET}${businessCreated._id}`,
        salt,
      );
      let keyReset = Buffer.from(hashedPassowrd).toString("base64");
      await SendEmail(
        businessCreated.email,
        "Verificación de contraseña",
        "confirm",
        {
          urlReset: `${keyReset}/${businessCreated._id}`,
          name: businessCreated.name.toUpperCase(),
        },
      );
      await _businessRepository.update(businessCreated._id, {
        urlReset: { url: keyReset, created: new Date() },
      });
      return businessCreated;
    }
  }

  /**
   *
   * @param {*} customer
   */
  async signUpCustomer(customer) {
    const { email } = customer;
    const customerExist = await _customerRepository.getCustomerByEmail(email);
    if (customerExist) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer already exists";
      throw error;
    } else {
      let customerCreated = await _customerRepository.create(customer);
      const salt = genSaltSync(5);
      const hashedPassowrd = hashSync(
        `${JWT_SECRET}${customerCreated._id}`,
        salt,
      );
      let keyReset = Buffer.from(hashedPassowrd).toString("base64");
      await SendEmail(
        customerCreated.email,
        "Verificación de contraseña",
        "confirm",
        {
          urlReset: `${keyReset}/${customerCreated._id}`,
          name: customerCreated.name.toUpperCase(),
        },
      );
      await _customerRepository.update(customerCreated._id, {
        urlReset: { url: keyReset, created: new Date() },
      });
      return customerCreated;
    }
  }

  /**
   *
   * @param {*} business
   */
  async signInBusiness(business) {
    const { email, dni, password } = business;
    let businessExist;
    if (email)
      businessExist = await _businessRepository.getBusinessByEmail(email);
    else businessExist = await _businessRepository.getBusinessByDni(dni);

    if (!businessExist) {
      const error = new Error();
      error.status = 404;
      error.message = "Business does not exist";
      throw error;
    }
    const validPassword = businessExist.comparePasswords(password);
    if (!validPassword) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid Password";
      throw error;
    }
    const businessToEncode = {
      id: businessExist._id,
      email: businessExist.email,
      rol: "business",
    };
    const token = generateToken(businessToEncode);
    return { token, business: businessExist };
  }

  /**
   *
   * @param {*} customer
   */
  async signInCustomer(customer) {
    const { email, password } = customer;
    const customerExist = await _customerRepository.getCustomerByEmail(email);
    if (!customerExist) {
      const error = new Error();
      error.status = 404;
      error.message = "Customer does not exist";
      throw error;
    }
    const validPassword = customerExist.comparePasswords(password);
    if (!validPassword) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid Password";
      throw error;
    }
    const customerToEncode = {
      id: customerExist._id,
      email: customerExist.email,
      dni: customerExist.dni,
      rol: "customer",
    };
    const token = generateToken(customerToEncode);
    return { token, customer: customerExist };
  }
  async getDni(dni) {
    return await GetDNI(dni);
  }

  async forgotPassword(email) {
    let businessExists = await _businessRepository.getBusinessByEmail(email);
    let customerExists = await _customerRepository.getCustomerByEmail(email);
    if (!businessExists && !customerExists) {
      const error = new Error();
      error.status = 403;
      error.message = "User does not found";
      throw error;
    }
    if (
      (businessExists && businessExists.urlReset.url !== "") ||
      (customerExists && customerExists.urlReset.url !== "")
    ) {
      const error = new Error();
      error.status = 400;
      error.message = "Operation not valid";
      throw error;
    }
    const salt = genSaltSync(5);
    const hashedPassowrd = hashSync(
      `${JWT_SECRET}${
        businessExists ? businessExists._id : customerExists._id
      }`,
      salt,
    );
    let keyReset = Buffer.from(hashedPassowrd).toString("base64");
    let responseEmail = await SendEmail(
      email,
      "Recuperación de contraseña",
      "reset",
      {
        urlReset: `${keyReset}/${
          businessExists ? businessExists._id : customerExists._id
        }`,
        name: businessExists
          ? businessExists.name.toUpperCase()
          : customerExists.name.toUpperCase(),
      },
    );
    if (businessExists)
      await _businessRepository.update(businessExists._id, {
        urlReset: { url: keyReset, created: new Date() },
      });
    else
      await _customerRepository.update(customerExists._id, {
        urlReset: { url: keyReset, created: new Date() },
      });
    return responseEmail;
  }

  async validateKey(id, key) {
    let businessExists = await _businessRepository.get(id);
    let customerExists = await _customerRepository.get(id);
    if (!businessExists && !customerExists) {
      const error = new Error();
      error.status = 400;
      error.message = "User does not found";
      throw error;
    }
    if (
      (businessExists && businessExists.urlReset.url !== key) ||
      (customerExists && customerExists.urlReset.url !== key)
    ) {
      return false;
    }
    return true;
  }

  async validateUser(email) {
    let business = await _businessRepository.getBusinessByEmail(email);
    let customer = await _customerRepository.getCustomerByEmail(email);
    if (business || customer) return true;
    return false;
  }

  async deleteKeys() {
    let businesses = await _businessRepository.getAll();
    let customers = await _customerRepository.getAll();
    businesses.map(async (key) => {
      if (moment().diff(key.urlReset.created, "hours") >= 4) {
        await _businessRepository.update(key._id, {
          urlReset: { url: "", created: new Date() },
        });
      }
    });
    customers.map(async (key) => {
      if (moment().diff(key.urlReset.created, "hours") >= 4) {
        await _customerRepository.update(key._id, {
          urlReset: { url: "", created: new Date() },
        });
      }
    });
    return true;
  }
}

module.exports = AuthService;
