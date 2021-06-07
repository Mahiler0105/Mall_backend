const { createContainer, asClass, asFunction, asValue } = require("awilix");

// CONFIG
const config = require("../config");
const app = require(".");

// ROTUTES
const Routes = require("../routes");
const {
     AuthRoutes,
     BusinessRoutes,
     CalificationRoutes,
     CustomerRoutes,
     ProductRoutes,
     HomeRoutes,
     PaymentRoutes,
     MembershipRoutes,
     SupportRoutes,
} = require("../routes/index.routes");

// CONTROLERS
const {
     AuthController,
     CalificationController,
     CustomerController,
     BusinessController,
     ProductController,
     HomeController,
     PaymentController,
     MembershipController,
     SupportController,
} = require("../controllers");

// SERVICES
const {
     BusinessService,
     CalificationService,
     CustomerService,
     AuthService,
     ProductService,
     ServService,
     HomeService,
     PaymentService,
     MembershipService,
     SupportService,
} = require("../services");

// REPOSITORIES
const {
     BusinessRepository,
     CalificationRepository,
     CustomerRepository,
     OrderRepository,
     ProductRepository,
     PurchaseRepository,
     ServiceRepository,
     HistoryRepository,
     DocumentRepository,
     MembershipRepository,
     CouponRepository,
     SupportRepository,
} = require("../repositories");

// MODELS
const { Customer, Business, Product, Calification, Order, Service, Purchase, History, Document, Membership, Coupon, Support } = require("../models");

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
     PaymentRoutes: asFunction(PaymentRoutes).singleton(),
     MembershipRoutes: asFunction(MembershipRoutes).singleton(),
     SupportRoutes: asFunction(SupportRoutes).singleton(),
     /*-----------------------*/
     // CONTROLLERS REGISTER  //
     AuthController: asClass(AuthController.bind(AuthController)).singleton(),
     ProductController: asClass(ProductController.bind(ProductController)).singleton(),
     CalificationController: asClass(CalificationController.bind(CalificationController)).singleton(),
     BusinessController: asClass(BusinessController.bind(BusinessController)).singleton(),
     CustomerController: asClass(CustomerController.bind(CustomerController)).singleton(),
     HomeController: asClass(HomeController.bind(HomeController)).singleton(),
     PaymentController: asClass(PaymentController.bind(PaymentController)).singleton(),
     MembershipController: asClass(MembershipController.bind(MembershipController)).singleton(),
     SupportController: asClass(SupportController.bind(SupportController)).singleton(),
     /*--------------------*/
     // SERVICES REGISTER  //
     AuthService: asClass(AuthService).singleton(),
     BusinessService: asClass(BusinessService).singleton(),
     CustomerService: asClass(CustomerService).singleton(),
     CalificationService: asClass(CalificationService).singleton(),
     ProductService: asClass(ProductService).singleton(),
     ServService: asClass(ServService).singleton(),
     HomeService: asClass(HomeService).singleton(),
     PaymentService: asClass(PaymentService).singleton(),
     MembershipService: asClass(MembershipService).singleton(),
     SupportService: asClass(SupportService).singleton(),
     /*------------------*/
     // REPOSITORIES REGISTER  //
     BusinessRepository: asClass(BusinessRepository).singleton(),
     CalificationRepository: asClass(CalificationRepository).singleton(),
     CustomerRepository: asClass(CustomerRepository).singleton(),
     OrderRepository: asClass(OrderRepository).singleton(),
     ProductRepository: asClass(ProductRepository).singleton(),
     PurchaseRepository: asClass(PurchaseRepository).singleton(),
     ServiceRepository: asClass(ServiceRepository).singleton(),
     HistoryRepository: asClass(HistoryRepository).singleton(),
     DocumentRepository: asClass(DocumentRepository).singleton(),
     MembershipRepository: asClass(MembershipRepository).singleton(),
     CouponRepository: asClass(CouponRepository).singleton(),
     SupportRepository: asClass(SupportRepository).singleton(),
     /*------------------*/
     // MODELS REGISTER  //
     Customer: asValue(Customer),
     Business: asValue(Business),
     Product: asValue(Product),
     Calification: asValue(Calification),
     Order: asValue(Order),
     Service: asValue(Service),
     Purchase: asValue(Purchase),
     History: asValue(History),
     Document: asValue(Document),
     Membership: asValue(Membership),
     Coupon: asValue(Coupon),
     Support: asValue(Support),
});

module.exports = container;
