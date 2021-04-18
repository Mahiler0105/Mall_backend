"use strict";

const fetch = require("node-fetch");

const facebookHandler = {
  operation: async token => {
    try {
      const pending = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`, {
        method: "GET" //  body: JSON.stringify(params),
        //  headers: {
        //    "Content-Type": "application/json",
        //    Authorization: token,
        //  },
        //  agent: httpAgent,

      }); // return await pending.json();

      return await pending.json().then(e => {
        if (e.data) {
          if (e.data.user_id) {
            return {
              id: e.data.user_id
            };
          }
        }

        return {
          id: null
        };
      });
    } catch (e) {
      throw new Error(e);
    }
  }
};

module.exports = async (token) => facebookHandler.operation(token).catch(error => {
  return {
    error: error.message
  };
});