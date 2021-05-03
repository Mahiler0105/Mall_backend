const BaseService = require("./base.service");
const { CloudStorage } = require("../helpers");

let _customerRepository = null;
let _historyRepository = null;

class CustomerService extends BaseService {
     constructor({ CustomerRepository, HistoryRepository }) {
          super(CustomerRepository);
          _customerRepository = CustomerRepository;
          _historyRepository = HistoryRepository;
     }

     async getCustomerByEmail(email) {
          return _customerRepository.getCustomerByEmail(email);
     }

     async update(id, entity) {
          if (!id) {
               const error = new Error();
               error.status = 400;
               error.message = "ID must be sent";
               throw error;
          }
          const customerExists = await _customerRepository.get(id);
          if (!customerExists) {
               const error = new Error();
               error.status = 400;
               error.message = "Customer does not found";
               throw error;
          }
          const newEntity = entity;
          if (newEntity.source) {
               const error = new Error();
               error.status = 400;
               error.message = "You do not have permission";
               throw error;
          }
          if (newEntity.password) {
               newEntity.urlReset = { url: "", created: new Date() };
          }
          return _customerRepository.update(id, newEntity);
     }

     async delete(id, jwt) {
          if (!id) {
               const error = new Error();
               error.status = 400;
               error.message = "ID must be sent";
               throw error;
          }
          const customerExists = await _customerRepository.get(id);
          if (!customerExists) {
               const error = new Error();
               error.status = 400;
               error.message = "Customer does not found";
               throw error;
          }
          if (jwt) {
               if (customerExists._id.toString() !== jwt.id) {
                    const error = new Error();
                    error.status = 400;
                    error.message = "Don't have permissions";
                    throw error;
               }
          }
          if (customerExists.avatar && customerExists.avatar.includes("default")) {
               await CloudStorage.deleteImage(customerExists.logo);
          }
       
          await _historyRepository.create({ ...customerExists.toJSON(), type: "customer" });
          await _customerRepository.delete(id);
          // await _customerRepository.update(id, { avatar: '', disabled: true });
          return true;
     }

     async saveAvatar(filename, id) {
          const customerExists = await _customerRepository.get(id);
          if (!customerExists) {
               const error = new Error();
               error.status = 400;
               error.message = "Customer does not found";
               throw error;
          }
          const urlAvatar = `avatar/${filename}`;
          if (customerExists.avatar && !customerExists.avatar.includes("default")) {
               await CloudStorage.deleteImage(customerExists.avatar);
          }
          await CloudStorage.saveImage(filename, urlAvatar);
          await _customerRepository.update(id, {
               avatar: urlAvatar,
          });
          return true;
     }
}

module.exports = CustomerService;
