const { genSaltSync, hashSync } = require('bcryptjs');
const moment = require('moment');
const { generateToken } = require('../helpers/jwt.helper');
const { GetDNI, GetRUC, SendEmail } = require('../helpers');

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
        const { email, source } = business;
        const businessExist = await _businessRepository.getBusinessByEmail(email);
        if (businessExist) {
            const error = new Error();
            error.status = 400;
            error.message = 'Business already exists';
            throw error;
        } else {
            const businessEntity = business;
            delete businessEntity.source;
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
        const { email, source } = customer;
        const customerExist = await _customerRepository.getCustomerByEmail(email);
        if (customerExist) {
            const error = new Error();
            error.status = 400;
            error.message = 'Customer already exists';
            throw error;
        } else {
            const customerEntity = business;
            delete customerEntity.source;
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
                await SendEmail(businessCreated.email, 'Confirmación cuenta', 'confirm', {
                    endpoint: `oauth/confirm/${keyReset}/${businessCreated._id}/0/${cryptSource}`,
                    name: businessCreated.name.toUpperCase(),
                });
            }
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
        if (email) businessExist = await _businessRepository.getBusinessByEmail(email);
        else businessExist = await _businessRepository.getBusinessByDni(dni);

        if (!businessExist) {
            const error = new Error();
            error.status = 404;
            error.message = 'Business does not exist';
            throw error;
        }
        const validPassword = businessExist.comparePasswords(password);
        if (!validPassword) {
            const error = new Error();
            error.status = 400;
            error.message = 'Invalid Password';
            throw error;
        }
        const businessToEncode = {
            id: businessExist._id,
            email: businessExist.email,
            rol: 'business',
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
            error.message = 'Customer does not exist';
            throw error;
        }
        const validPassword = customerExist.comparePasswords(password);
        if (!validPassword) {
            const error = new Error();
            error.status = 400;
            error.message = 'Invalid Password';
            throw error;
        }
        const customerToEncode = {
            id: customerExist._id,
            email: customerExist.email,
            dni: customerExist.dni,
            rol: 'customer',
        };
        const token = generateToken(customerToEncode);
        return { token, customer: customerExist };
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
        const salt = genSaltSync(5);
        const hashedPassowrd = hashSync(`${JWT_SECRET}${businessExists ? businessExists._id : customerExists._id}`, salt);
        const keyReset = Buffer.from(hashedPassowrd).toString('base64');
        const responseEmail = await SendEmail(email, 'Recuperación de contraseña', 'reset', {
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

    async validateKey(id, key) {
        const businessExists = await _businessRepository.get(id);
        const customerExists = await _customerRepository.get(id);
        if (!businessExists && !customerExists) {
            const error = new Error();
            error.status = 400;
            error.message = 'User does not found';
            throw error;
        }
        if ((businessExists && businessExists.urlReset.url !== key) || (customerExists && customerExists.urlReset.url !== key)) {
            return false;
        }
        return true;
    }

    async validateUser(email) {
        const business = await _businessRepository.getBusinessByEmail(email);
        const customer = await _customerRepository.getCustomerByEmail(email);
        if (business || customer) return true;
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
        });
        customers.map(async (key) => {
            if (moment().diff(key.urlReset.created, 'hours') >= 4) {
                await _customerRepository.update(key._id, {
                    urlReset: { url: '', created: new Date() },
                });
            }
        });
        return true;
    }
}

module.exports = AuthService;
