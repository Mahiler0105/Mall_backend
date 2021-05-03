const BaseRepository = require("./base.repository");
let _historyModel = null;

class HistoryRepository extends BaseRepository {
     constructor({ History }) {
          super(History);
          _historyModel = History;
     }
}

module.exports = HistoryRepository;
