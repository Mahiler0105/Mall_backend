const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

const { BUCKET_NAME } = require("../config");

const gc = new Storage();
const puStorage = (f) => `storage/${f}`;

module.exports = {
     saveImage: async (filename, urlPublic) => {
          try {
               await gc.bucket(BUCKET_NAME).upload(puStorage(filename), {
                    destination: urlPublic,
                    gzip: true,
                    metadata: {
                         cacheContro: "no-cache",
                    },
               });
               fs.unlinkSync(puStorage(filename));
          } catch (err) {
               const error = new Error();
               error.status = 500;
               error.message = err.message;
               throw error;
          }
     },
     deleteImage: async (filename) => {
          await gc.bucket(BUCKET_NAME).file(puStorage(filename)).delete();
     },

     deleteLocalImage: (filename) => {
          try {
               fs.unlinkSync(puStorage(filename));
          } catch (err) {
               const error = new Error();
               error.status = 500;
               error.message = "Internal server error";
               throw error;
          }
     },
};
