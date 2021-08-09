if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    APPLICATION_NAME: process.env.APPLICATION_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    CACHE_KEY: process.env.CACHE_KEY,
    SWAGGER_PATH: `../config/swagger/${process.env.SWAGGER_DOC}.json`,
    BUCKET_NAME: process.env.BUCKET_NAME,
    USER_EMAIL: process.env.USER_EMAIL,
    PASS_EMAIL: process.env.PASS_EMAIL,
    KEY_STRIPE: process.env.PUBLISHABLE_KEY,
    MERCADO_PAGO: process.env.MERCADO_PAGO,
    ADMIN_SECRET: process.env.ADMIN_SECRET,
    ADMIN_URL: process.env.ADMIN_URL,
};
