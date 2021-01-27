const mockingoose = require('mockingoose').default;
const { CustomerRepository } = require('../../../src/repositories');
const { Customer } = require('../../../src/models');
const {
    CustomerModelMock: { customer },
} = require('../../mocks');

describe('Customer Repository Test', () => {
    beforeEach(() => {
        mockingoose.resetAll();
        jest.clearAllMocks();
    });

    it('Should return a CUSTOMER by Id', async () => {
        const _customer = { ...customer };
        mockingoose(Customer).toReturn(customer, 'findOne');
        const _customerRepository = new CustomerRepository({ Customer });
        const expected = await _customerRepository.get(_customer._id);
        expect(JSON.parse(JSON.stringify(expected))).toMatchObject(_customer);
    });

    it('Should return a CUSTOMER by Email', async () => {
        const _customer = { ...customer };
        mockingoose(Customer).toReturn(customer, 'findOne');
        const _customerRepository = new CustomerRepository({ Customer });
        const expected = await _customerRepository.getCustomerByEmail(_customer.email);
        expect(JSON.parse(JSON.stringify(expected))).toMatchObject(_customer);
    });

    it('Should update an especific CUSTOMER by Id', async () => {
        const _customer = { ...customer };
        mockingoose(Customer).toReturn(customer, 'findOneAndUpdate');
        const _customerRepository = new CustomerRepository({ Customer });
        const expected = await _customerRepository.update(customer._id, {
            name: 'test',
        });
        expect(JSON.parse(JSON.stringify(expected))).toMatchObject(_customer);
    });

    it('Should delete an especific CUSTOMER by Id', async () => {
        const _customer = { ...customer };
        mockingoose(Customer).toReturn(customer, 'findOneAndDelete');
        const _customerRepository = new CustomerRepository({ Customer });
        const expected = await _customerRepository.delete(customer._id);

        expect(JSON.parse(JSON.stringify(expected))).toEqual(_customer);
    });
});
