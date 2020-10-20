const { createContainer, asClass, asFunction, asValue } = require("awilix");

// CONFIG
const config = require("../config");
const app = require(".");

// ROTUTES
const { UserRoutes } = require("../routes/index.routes");
const Routes = require("../routes");

// CONTROLERS
const { UserController } = require("../controllers");

// SERVICES
const { UserService } = require("../services");

// REPOSITORIES
const { UserRepository } = require("../repositories");

// MODELS
const {
  Customer,
  Business,
  Product,
  Calification,
  Order,
  Service,
  Purchase,
} = require("../models");

// INICIALIZAR APP
const container = createContainer();

container.register({
  /*------------------*/
  // CREATION SERVER  //
  app: asClass(app).singleton(),
  router: asFunction(Routes).singleton(),
  config: asValue(config),
  /*------------------*/
  // ROUTES REGISTER  //
  UserRoutes: asFunction(UserRoutes).singleton(),
  /*-----------------------*/
  // CONTROLLERS REGISTER  //
  UserController: asClass(UserController.bind(UserController)).singleton(),
  /*--------------------*/
  // SERVICES REGISTER  //
  UserService: asClass(UserService).singleton(),
  /*------------------*/
  // REPOSITORIES REGISTER  //
  UserRepository: asClass(UserRepository).singleton(),
  /*------------------*/
  // MODELS REGISTER  //
  Customer: asValue(Customer),
  Business: asValue(Business),
  Product: asValue(Product),
  Calification: asValue(Calification),
  Order: asValue(Order),
  Service: asValue(Service),
  Purchase: asValue(Purchase),
});
module.exports = container;
