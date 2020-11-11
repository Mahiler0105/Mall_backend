let _authService = null;

class AuthController {
  constructor({ AuthService }) {
    _authService = AuthService;
  }

  async signUpBusiness(req, res) {
    const { body } = req;
    const createBusiness = await _authService.signUpBusiness(body);
    return res.status(201).send(createBusiness);
  }

  async signUpCustomer(req, res) {
    const { body } = req;
    const createCustomer = await _authService.signUpCustomer(body);
    return res.status(201).send(createCustomer);
  }

  async signInBusiness(req, res) {
    const { body } = req;
    const business = await _authService.signInBusiness(body);
    return res.send(business);
  }

  async signInCustomer(req, res) {
    const { body } = req;
    const customer = await _authService.signInCustomer(body);
    return res.send(customer);
  }

  async getDni(req, res) {
    const { dni } = req.params;
    const userDni = await _authService.getDni(dni);
    return res.send(userDni);
  }

  async forgotPassword(req, res) {
    const { email } = req.params;
    const response = await _authService.forgotPassword(email);
    return res.send(response);
  }

  async validateUser(req, res) {
    const { emailUser } = req.params;
    const validate = await _authService.validateUser(emailUser);
    return res.send(validate);
  }

  async validateKey(req, res) {
    const { userId, key } = req.params;
    const response = await _authService.validateKey(userId, key);
    return res.send(response);
  }

  async deleteKeys(req, res) {
    const response = await _authService.deleteKeys();
    return res.send(response);
  }
}

module.exports = AuthController;
