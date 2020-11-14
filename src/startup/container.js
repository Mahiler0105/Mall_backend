const { createContainer, asClass, asFunction, asValue } = require("awilix");

// CONFIG
const config = require("../config");
const app = require(".");

// ROTUTES
const Routes = require("../routes");
const { AuthRoutes, BusinessRoutes, CalificationRoutes, CustomerRoutes, ProductRoutes, HomeRoutes } = require("../routes/index.routes");

// CONTROLERS
const { AuthController, CalificationController, CustomerController, BusinessController, ProductController, HomeController } = require("../controllers");

// SERVICES
const { BusinessService, CalificationService, CustomerService, AuthService, ProductService, HomeService } = require("../services");

// REPOSITORIES
const { BusinessRepository, CalificationRepository, CustomerRepository, OrderRepository, ProductRepository, PurchaseRepository, ServiceRepository } = require("../repositories");

// MODELS
const { Customer, Business, Product, Calification, Order, Service, Purchase } = require("../models");

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
  BusinessRoutes: asFunction(BusinessRoutes).singleton(),
  AuthRoutes: asFunction(AuthRoutes).singleton(),
  CalificationRoutes: asFunction(CalificationRoutes).singleton(),
  CustomerRoutes: asFunction(CustomerRoutes).singleton(),
  ProductRoutes: asFunction(ProductRoutes).singleton(),
  HomeRoutes: asFunction(HomeRoutes).singleton(),
  /*-----------------------*/
  // CONTROLLERS REGISTER  //
  AuthController: asClass(AuthController.bind(AuthController)).singleton(),
  ProductController: asClass(ProductController.bind(ProductController)).singleton(),
  CalificationController: asClass(CalificationController.bind(CalificationController)).singleton(),
  BusinessController: asClass(BusinessController.bind(BusinessController)).singleton(),
  CustomerController: asClass(CustomerController.bind(CustomerController)).singleton(),
  HomeController: asClass(HomeController.bind(HomeController)).singleton(),
  /*--------------------*/
  // SERVICES REGISTER  //
  AuthService: asClass(AuthService).singleton(),
  BusinessService: asClass(BusinessService).singleton(),
  CustomerService: asClass(CustomerService).singleton(),
  CalificationService: asClass(CalificationService).singleton(),
  ProductService: asClass(ProductService).singleton(),
  HomeService: asClass(HomeService).singleton(),
  /*------------------*/
  // REPOSITORIES REGISTER  //
  BusinessRepository: asClass(BusinessRepository).singleton(),
  CalificationRepository: asClass(CalificationRepository).singleton(),
  CustomerRepository: asClass(CustomerRepository).singleton(),
  OrderRepository: asClass(OrderRepository).singleton(),
  ProductRepository: asClass(ProductRepository).singleton(),
  PurchaseRepository: asClass(PurchaseRepository).singleton(),
  ServiceRepository: asClass(ServiceRepository).singleton(),
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
