if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  APPLICATION_NAME: process.env.APPLICATION_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  CACHE_KEY: process.env.CACHE_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
  USER_EMAIL: process.env.USER_EMAIL,
  PASS_EMAIL: process.env.PASS_EMAIL,
};
