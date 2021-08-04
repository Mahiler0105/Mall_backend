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

     async signInOauth(req, res) {
          const { body } = req;
          const response = await _authService.signInOauth(body);
          return res.send(response);
     }

     async getDni(req, res) {
          const { dni } = req.params;
          const userDni = await _authService.getDni(dni);
          return res.send(userDni);
     }

     async getRuc(req, res) {
          const { ruc } = req.params;
          const userRuc = await _authService.getRuc(ruc);
          return res.send(userRuc);
     }

     async updateCurrency(req, res) {
          const { dia, mes, anio } = req.query;
          const result = await _authService.updateCurrency({ dia, mes, anio });
          return res.send(result);
     }

     async getCurrency(req, res) {
          const result = await _authService.getCurrency();
          return res.send(result);
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

     async confirmOauth(req, res) {
          const { body } = req;
          const validate = await _authService.confirmOauth(body);
          return res.send(validate);
     }

     async validateKey(req, res) {
          const { userId, key, rol } = req.params;
          const response = await _authService.validateKey(userId, key, rol);
          return res.send(response);
     }

     async deleteKeys(_req, res) {
          const response = await _authService.deleteKeys();
          return res.send(response);
     }

     async verifyPassword(req, res) {
          const {
               body,
               params: { id },
          } = req;
          const responseVP = await _authService.verifyPassword(id, body);
          return res.send(responseVP);
     }

     async changeEmail(req, res) {
          const { body } = req;
          const responseCP = await _authService.changeEmail(body);
          return res.send(responseCP);
     }

     async verifyCodeEmail(req, res) {
          const { body } = req;
          const responseVCE = await _authService.verifyCodeEmail(body);
          return res.send(responseVCE);
     }

     async refreshCurrency(req, res) {
          const { body } = req;
          const response = await _authService.updateCurrency(body);
          return res.send(response);
     }

     async reactivate(req, res) {
          const {
               body,
               params: { email },
               user,
          } = req;
          const reactivateResponse = await _authService.reactivate(body, email, user);
          return res.send(reactivateResponse);
     }

     async deactivate(req, res) {
          const {
               body,
               params: { idUser },
               user,
          } = req;
          const deactivateResponse = await _authService.deactivate(body, idUser, user);
          return res.send(deactivateResponse);
     }

}

module.exports = AuthController;
