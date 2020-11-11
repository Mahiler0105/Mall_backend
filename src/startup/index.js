const express = require("express");

let _config = null;
let _server = null;

class Server {
  constructor({ config, router }) {
    _config = config;
    _server = express().use(router);
  }

  start() {
    return new Promise((resolve) => {
      _server.listen(_config.PORT, () => {
        console.log(`${_config.APPLICATION_NAME} running on port ${_config.PORT}`);
      });
      resolve();
    });
  }
}

module.exports = Server;
