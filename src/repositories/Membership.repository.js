const BaseRepository = require("./base.repository");
let _membershipModel = null;

class MembershipRepository extends BaseRepository {
     constructor({ Membership }) {
          super(Membership);
          _membershipModel = Membership;
     }

     async byClient(idBusiness) {
          return _membershipModel.find({ idBusiness, authorized: "confirmed" });
     }

     // async byRuc(ruc) {
     //      return _membershipModel.find({ ruc });
     // }

     async byPreferenceId(last_preference_id) {
          return _membershipModel.find({ last_preference_id });
     }
}

module.exports = MembershipRepository;
