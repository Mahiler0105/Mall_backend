const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const { BUCKET_NAME } = require('../config');

const gc = new Storage({
    keyFilename: path.join(__dirname, '../../lerietmall-302923-436bd293b801.json'),
    projectId: 'lerietmall-302923',
});

module.exports = {
    saveImage: async (filename, urlPublic) => {
        await gc.bucket(BUCKET_NAME).upload(filename, {
            destination: urlPublic,
            gzip: true,
            metadata: {
                cacheContro: 'no-cache',
            },
        });
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
