const { generateToken } = require("../helpers/jwt.helper");

let _userService = null;

class AuthService {
  constructor({ UserService }) {
    _userService = UserService;
  }
  async signUp(user) {
    const { dni } = user;
    const userExist = await _userService.getUserByDni(dni, "POST");
    if (userExist) {
      const error = new Error();
      error.status = 400;
      error.message = "User already exists";
      throw error;
    } else {
      return await _userService.create(user);
    }
  }

  async signIn(user) {
    const { dni, password } = user;
    const userExist = await _userService.getUserByDni(dni);
    if (!userExist) {
      const error = new Error();
      error.status = 404;
      error.message = "User does not exist";
      throw error;
    }
    const validPassword = userExist.comparePasswords(password);
    if (!validPassword) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid Password";
      throw error;
    }
    const userToEncode = {
      dni: userExist.dni,
      id: userExist._id,
    };
    const token = generateToken(userToEncode);
    return { token, user: userE };
  }
}

module.exports = AuthService;
