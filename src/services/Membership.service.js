const moment = require("moment");

let _membershipRepository = null;
let _businessRepository = null;
let _authService = null;

class MembershipService {
     constructor({ BusinessRepository, MembershipRepository, AuthService }) {
          _membershipRepository = MembershipRepository;
          _businessRepository = BusinessRepository;
          _authService = AuthService;
     }

     async refreshKeys() {
          const memberships = await _membershipRepository.getAll();
          await memberships.map(async (key) => {
               if (key.authorized === "confirmed" && moment(key.next_void).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
                    await _membershipRepository.update(key._id, { must_pay: true });
               }
               if (key.authorized === "cancelled" && !key.totally_annulled) {
                    if (key.remain_days > 0) {
                         await _membershipRepository.update(key._id, { remain_days: moment(key.next_void).diff(moment().toNow(), "days") });
                    } else {
                         await _membershipRepository.update(key._id, { totally_annulled: true });
                    }
               }
          });
          return true;
     }

     async cancelMembership(entity) {
          const error = new Error();
          const { ruc, id, code, email } = entity;
          if (!ruc && !id) {
               error.status = 500;
               error.message = "Please send id and ruc";
               throw error;
          }
          const business = await _businessRepository.get(id);
          if (!business) {
               error.status = 404;
               error.message = "Not found";
               throw error;
          }
          const _proceed = await _authService.verifyCodeEmail({ code, email });
          if (!_proceed) {
               error.status = 403;
               error.message = "Not authorized";
               throw error;
          }
          const member = _membershipRepository.byClient(id);
          if (member.length === 1) {
               const last_cancelled_date = moment().tz("America/Lima").toISOString();
               let cancelled_dates;
               if (member[0].cancelled_dates) cancelled_dates = [].concat(member[0].cancelled_dates).push(last_cancelled_date);
               else cancelled_dates = [last_cancelled_date];
               await _membershipRepository.update(member[0]._id, {
                    authorized: "cancelled",
                    last_cancelled_date,
                    cancelled_dates,
                    remain_days: moment(member[0].next_void).diff(moment().toNow(), "days"),
               });
               return true;
          }
          error.status = 500;
          error.message = "Membership deprecated or not found";
          throw error;
     }

     async continueMembership(entity) {
          const error = new Error();
          const { ruc, id, code, email } = entity;
          if (!ruc && !id) {
               error.status = 500;
               error.message = "Please send id and ruc";
               throw error;
          }
          const business = await _businessRepository.get(id);
          if (!business) {
               error.status = 404;
               error.message = "Not found";
               throw error;
          }
          const _proceed = await _authService.verifyCodeEmail({ code, email });
          if (!_proceed) {
               error.status = 403;
               error.message = "Not authorized";
               throw error;
          }
          const member = _membershipRepository.byClient(id);
          if (member.length === 1) {
               if (member[0].remain_days > 0 && !member[0].totally_annulled) {
                    await _membershipRepository.update(member[0]._id, {
                         authorized: "confirmed",
                         remain_days: 0,
                    });
                    return true;
               }
          }
          error.status = 500;
          error.message = "Membership deprecated or not found";
          throw error;
     }
}

module.exports = MembershipService;
