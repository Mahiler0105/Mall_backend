"use strict";

let _homeService = null;

class HomeController {
  constructor({
    HomeService
  }) {
    _homeService = HomeService;
  }

  async getHome(req, res) {
    const homeObject = await _homeService.getHome();
    return res.send(homeObject);
  }

}

module.exports = HomeController;