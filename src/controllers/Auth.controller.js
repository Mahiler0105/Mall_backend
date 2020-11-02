let _authService = null;

class AuthController {
  constructor({ AuthService }) {
    _authService = AuthService;
  }
  async signUpBusiness(req, res) {
    const { body } = req;
    let createBusiness = await _authService.signUpBusiness(body);
    return res.status(201).send(createBusiness);
  }
  async signUpCustomer(req, res) {
    const { body } = req;
    let createCustomer = await _authService.signUpCustomer(body);
    return res.status(201).send(createCustomer);
  }
  async signInBusiness(req, res) {
    const { body } = req;
    let business = await _authService.signInBusiness(body);
    return res.send(business);
  }
  async signInCustomer(req, res) {
    const { body } = req;
    let customer = await _authService.signInCustomer(body);
    return res.send(customer);
  }
  async getDni(req, res) {
    const { dni } = req.params;
    let userDni = await _authService.getDni(dni);
    return res.send(userDni);
  }
}

module.exports = AuthController;
