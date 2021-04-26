const { genSaltSync, hashSync } = require('bcryptjs');
const moment = require('moment');
const { generateToken, decodeToken } = require('../helpers/jwt.helper');
const { GetDNI, GetRUC, SendEmail, GetFacebookId } = require('../helpers');

const { JWT_SECRET } = require('../config');

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
        const { email, source, token: jwt } = business;
        const businessExist = await _businessRepository.getBusinessByEmail(email);
        const error = new Error();
        if (businessExist) {
            error.status = 400;
            error.message = 'Business already exists';
            throw error;
        } else {
            const businessEntity = business;
            // delete businessEntity.source;

            if (source !== 'email') {
                const saltSource = genSaltSync(10);
                if (source === 'facebook') {
                    const { id } = await GetFacebookId(jwt);

                    if (id) businessEntity.password = hashSync(id, saltSource);
                    else {
                        error.status = 400;
                        error.message = 'Invalid token';
                        throw error;
                    }
                } else {
                    const payload = decodeToken(jwt);
                    if (payload.sub) businessEntity.password = hashSync(payload.sub, saltSource);
                    else {
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
                    name: businessCreated.name.toUpperCase(),
                });
            } else {
                const cryptSource = Buffer.from(source).toString('base64');
                await SendEmail(businessCreated.email, 'Confirmación cuenta', 'confirm', {
                    endpoint: `oauth/confirm/${keyReset}/${businessCreated._id}/1/${cryptSource}`,
                    name: businessCreated.name.toUpperCase(),
                });
            }
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
        const { email, source, token: jwt } = customer;
        const customerExist = await _customerRepository.getCustomerByEmail(email);
        const error = new Error();
        if (customerExist) {
            error.status = 400;
            error.message = 'Customer already exists';
            throw error;
        } else {
            const customerEntity = customer;
            // delete customerEntity.source;
            if (!!source && source !== 'email') {
                const saltSource = genSaltSync(10);
                if (source === 'facebook') {
                    const { id } = await GetFacebookId(jwt);

                    if (id) customerEntity.password = hashSync(id, saltSource);
                    else {
                        error.status = 400;
                        error.message = 'Invalid token';
                        throw error;
                    }
                } else {
                    const payload = decodeToken(jwt);
                    if (payload.sub) customerEntity.password = hashSync(payload.sub, saltSource);
                    else {
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
                    name: customerCreated.name.toUpperCase(),
                });
            } else {
                const cryptSource = Buffer.from(source).toString('base64');
                await SendEmail(customerCreated.email, 'Confirmación de cuenta', 'confirm', {
                    endpoint: `oauth/confirm/${keyReset}/${customerCreated._id}/0/${cryptSource}`,
                    name: customerCreated.name.toUpperCase(),
                });
            }
            await _customerRepository.update(customerCreated._id, {
                urlReset: { url: keyReset, created: new Date() },
            });
            return customerCreated;
        }
    }

    async signInOauth(entity) {
        const { email, password, token: jwt } = entity;
        let accessEntity;
        let emailEntity = email;
        let entityRol = 'business';
        if (!email && !password) {
            const payload = decodeToken(jwt);
            if (payload.iss.includes('google')) emailEntity = payload.email;
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
            entityRol = 'customer';
        }

        const error = new Error();
        if (!entityLogin || entityLogin?.inactive) {
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
            rol: entityRol,
        };
        const token = generateToken(entityToEncode);
        return { token, [entityRol]: entityLogin };
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
        if ((businessExists && businessExists.urlReset.url !== '') || (customerExists && customerExists.urlReset.url !== '')) {
            const error = new Error();
            error.status = 400;
            error.message = 'Already exists key email';
            throw error;
        }
        if ((businessExists && businessExists.source !== 'email') || (customerExists && customerExists.source !== 'email')) {
            const error = new Error();
            error.status = 405;
            error.message = 'You do not have permissions';
            throw error;
        }
        const salt = genSaltSync(5);
        const hashedPassowrd = hashSync(`${JWT_SECRET}${businessExists ? businessExists._id : customerExists._id}`, salt);
        const keyReset = Buffer.from(hashedPassowrd).toString('base64');
        const responseEmail = await SendEmail(email, 'LERIETMALL: Recuperación de contraseña', 'reset', {
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
        const { rsp, nst, knc, nfr, mth, vng, lgn, nbl, dsr, id } = params;
        const businessExists = await _businessRepository.get(id);
        const customerExists = await _customerRepository.get(id);
        if (!customerExists && !businessExists) return false;

        const _data = { urlReset: { url: '', created: new Date() } };
        let _token;
        if (rsp && nst && knc && nfr && mth && vng && lgn && nbl && dsr) {
            _token = String(rsp).concat(nst, knc, nfr, mth, vng, lgn, nbl, dsr);
            if (_token.split('.').length === 3) {
                try {
                    const payload = decodeToken(_token);
                    if (payload.sub) {
                        let _result;
                        if (customerExists) _result = _customerRepository.update(id, _data);
                        else _result = _businessRepository.update(id, _data);
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
                    if (customerExists) _result = _customerRepository.update(id, _data);
                    else _result = _businessRepository.update(id, _data);
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
            if (moment().diff(key.urlReset.created, 'hours') >= 4) {
                await _businessRepository.update(key._id, {
                    urlReset: { url: '', created: new Date() },
                });
            }
            if (moment().diff(key.inactive.created, 'days') === 7) {
                await SendEmail(key.email, 'LERIETMALL: Aviso desactivación de cuenta', 'default', {
                    title_1: 'Desactivación',
                    title_2: 'de cuenta',
                    name: key.name.toUpperCase(),
                    message: 'le recordamos que aun estas a tiempo de activar tu cuenta, te quedan 7 dias. Atte. equipo de Lerietmall',
                });
            }
            if (moment().diff(key.codeVerification.created, 'minutes') >= 5) {
                await _businessRepository.update(key._id, {
                    codeVerification: { code: '', created: new Date() },
                });
            }
        });
        customers.map(async (key) => {
            if (moment().diff(key.urlReset.created, 'hours') >= 4) {
                await _customerRepository.update(key._id, {
                    urlReset: { url: '', created: new Date() },
                });
            }
            if (moment().diff(key.codeVerification.created, 'minutes') >= 5) {
                await _customerRepository.update(key._id, {
                    codeVerification: { code: '', created: new Date() },
                });
            }
            if (moment().diff(key.inactive.created, 'days') === 7) {
                await SendEmail(key.email, 'LERIETMALL: Aviso desactivación de cuenta', 'default', {
                    title_1: 'Desactivación',
                    title_2: 'de cuenta',
                    name: key.name.toUpperCase(),
                    message: 'le recordamos que aun estas a tiempo de activar tu cuenta, te quedan 7 dias. Atte. equipo de Lerietmall',
                });
            }
        });
        return true;
    }

    async verifyPassword(id, { old_password: oldPassword, new_password: newPassword }) {
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
        if (businessExists?.comparePasswords(oldPassword) || customerExists?.comparePasswords(oldPassword)) {
            if (businessExists) await _businessRepository.update(id, { password: newPassword });
            else await _customerRepository.update(id, { password: newPassword });
            return SendEmail(businessExists ? businessExists.email : customerExists.email, 'LERIETMALL: Tu contraseña ha sido cambiada', 'change_pass', {
                name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
            });
        }
        return false;
    }

    async changeEmail({ email }) {
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
        if (businessExists?.codeVerification?.code || customerExists?.codeVerification?.code) {
            error.status = 400;
            error.message = 'Code already exists';
            throw error;
        }
        const codeVerification = Math.random().toString(36).substr(2, 6).toUpperCase();
        if (businessExists) await _businessRepository.update(businessExists._id, { codeVerification: { code: codeVerification, created: new Date() } });
        else await _customerRepository.update(customerExists.id, { codeVerification: { code: codeVerification, created: new Date() } });
        return SendEmail(businessExists ? businessExists.email : customerExists.email, 'LERIETMALL: CODIGO de confirmación', 'change_email', {
            name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
            code_verification: codeVerification,
        });
    }

    async verifyCodeEmail({ code, email }) {
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
        return businessExists?.codeVerification?.code === code || customerExists?.codeVerification?.code === code;
    }

    async validateRandD(code, idUser, jwt) {
        const error = new Error();
        if (!idUser) {
            error.status = 400;
            error.message = 'ID must be sent';
            throw error;
        }
        const businessExists = await _businessRepository.get(idUser);
        const customerExists = await _customerRepository.get(idUser);
        if (!customerExists || !businessExists) {
            error.status = 400;
            error.message = 'User does not found';
            throw error;
        }
        if (jwt) {
            if (customerExists?._id.toString() !== jwt?.id || businessExists?._id.toString() !== jwt?.id) {
                error.status = 400;
                error.message = "Don't have permissions";
                throw error;
            }
        }
        if (customerExists?.codeVerification?.code !== code || businessExists?.codeVerification?.code !== code) {
            return false;
        }
        return true;
    }

    async reactivate({ code }, idUser, jwt) {
        const isValid = validateRandD(code, idUser, jwt);
        if (!isValid) return false;
        if (customerExists) customerExists.deleteField(isUser, 'inactive');
        else businessExists.deleteField(isUser, 'inactive');
        await SendEmail(businessExists ? businessExists.email : customerExists.email, 'LERIETMALL: Activación de cuenta', 'default', {
            title_1: 'Activación',
            title_2: 'de cuenta',
            name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
            message: 'nos da gusto que vuelvas a estar con nosotros, no olvides que tiene una forma facil de comunicarte con nosotros, atte equipo Lerietmall.',
        });
        return true;
    }

    async deactivate({ code, reason }, idUser, jwt) {
        const isValid = validateRandD(code, idUser, jwt);
        if (!isValid) return false;
        if (customerExists) customerExists.update(isUser, { inactive: { created: new Date(), reason } });
        else businessExists.update(isUser, { inactive: { created: new Date(), reason } });
        await SendEmail(businessExists ? businessExists.email : customerExists.email, 'LERIETMALL: Desactivacióń de cuenta', 'default', {
            title_1: 'Desactivación',
            title_2: 'de cuenta',
            name: businessExists ? businessExists.name.toUpperCase() : customerExists.name.toUpperCase(),
            message: 'tiene 15 dias para volver a activarla sino se le eliminar la cuenta indefinidamente.',
        });
        return true;
    }
}

module.exports = AuthService;
