const BaseRepository = require("./base.repository");
let _tokenModel = null;

class TokenRepository extends BaseRepository {
     constructor({ Token }) {
          super(Token);
          _tokenModel = Token;
     }

     async getDoc(document) {
          return _tokenModel.findOne({ document });
     }

}

module.exports = TokenRepository;
