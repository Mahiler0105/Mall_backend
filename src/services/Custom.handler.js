const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
const { BUCKET_NAME } = require("../config");

const gc = new Storage({
  keyFilename: path.join(__dirname, "../../lerietmall-be9efc3ee5d7.json"),
  projectId: "lerietmall",
});

module.exports = {
  imageSave: async (filename, urlPublic) => {
    await gc.bucket(BUCKET_NAME).upload(filename, {
      destination: urlPublic,
      gzip: true,
      metadata: {
        cacheContro: "no-cache",
      },
    });
    try {
      fs.unlinkSync(filename);
    } catch (err) {
      const error = new Error();
      error.status = 500;
      error.message = "Internal server error";
      throw error;
    }
  },
};
