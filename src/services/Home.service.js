let _businessRepository = null;
let _productRepository = null;
let _serviceRepository = null;

class HomeService {
     constructor({ ProductRepository, ServiceRepository, BusinessRepository }) {
          _businessRepository = BusinessRepository;
          _productRepository = ProductRepository;
          _serviceRepository = ServiceRepository;
     }

     async getHome() {
          const categories = await _businessRepository.getCategoryBusiness();
          const topCategory = await Promise.all(
               categories.map(async (e) => {
                    let keyOject;
                    if (e._id === "services") keyOject = await _serviceRepository.getTopService();
                    else keyOject = await _productRepository.getProductCategory(e._id);
                    return keyOject.map((element) => {
                         return {
                              _id: element._id,
                              name: element.name,
                              price: element.price,
                              image: element.images.shift(),
                              counter: element.counter,
                              type: e._id === "services" ? "S" : "P",
                              specification: {
                                   color: element?.specification?.color[0] || null,
                                   size: element?.specification?.size[0] || null,
                              },
                         };
                    });
               })
          ).then((res) => {
               return res.reduce((obj, item, key) => {
                    return {
                         ...obj,
                         [`${key}_${categories[key]._id}`]: item,
                    };
               }, {});
          });

          let topBusiness = await _businessRepository.getBusinessByCounter();
          topBusiness = topBusiness.map((element) => {
               return {
                    _id: element._id,
                    counter: element.counter,
                    nameBusiness: element.name,
                    logoBusiness: element.logo ? element.logo : "",
                    category: element.category,
               };
          });
          return { topCategory, topBusiness };
     }

     
}

module.exports = HomeService;
