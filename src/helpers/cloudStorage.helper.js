const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

const { BUCKET_NAME } = require('../config');

const gc = new Storage();

module.exports = {
    saveImage: async (filename, urlPublic) => {
        try {
            await gc.bucket(BUCKET_NAME).upload(filename, {
                destination: urlPublic,
                gzip: true,
                metadata: {
                    cacheContro: 'no-cache',
                },
            });
        } catch (err) {
            const error = new Error();
            error.status = 500;
            error.message = 'Internal server error';
            throw error;
        }

        try {
            fs.unlinkSync(filename);
        } catch (err) {
            const error = new Error();
            error.status = 500;
            error.message = 'Internal server error';
            throw error;
        }
    },
    deleteImage: async (filename) => {
        await gc.bucket(BUCKET_NAME).file(filename).delete();
    },

    deleteLocalImage: (filename) => {
        try {
            fs.unlinkSync(filename);
        } catch (err) {
            const error = new Error();
            error.status = 500;
            error.message = 'Internal server error';
            throw error;
        }
    },
};
