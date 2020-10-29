const { generateToken } = require("../helpers/jwt.helper");

let _businessService = null;
let _customerService = null;

class AuthService {
  constructor({ BusinessService, CustomerService }) {
    _businessService = BusinessService;
    _customerService = CustomerService;
  }

  /**
   *
   * @param {*} business
   */
  async signUpBusiness(business) {
    const { email } = business;
    const businessExist = await _businessService.getBusinessByEmail(email);
    if (businessExist) {
      const error = new Error();
      error.status = 400;
      error.message = "Business already exists";
      throw error;
    } else {
      return await _businessService.create(business);
    }
  }
  /**
   *
   * @param {*} customer
   */
  async signUpCustomer(customer) {
    const { email } = customer;
    const customerExist = await _customerService.getCustomerByEmail(email);
    if (customerExist) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer already exists";
      throw error;
    } else {
      return await _customerService.create(customer);
    }
  }

  /**
   *
   * @param {*} business
   */
  async signInBusiness(business) {
    const { email, password } = business;
    const businessExist = await _businessService.getBusinessByEmail(email);
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
    const customerExist = await _customerService.getCustomerByEmail(email);
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
}

module.exports = AuthService;
