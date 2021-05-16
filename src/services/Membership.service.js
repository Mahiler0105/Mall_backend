const moment = require("moment");
import { Payment } from "../helpers";

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
               if (String(key.first_paid) === "false") {
                    await _membershipRepository.delete(key._id);
               }
               if (key.authorized === "confirmed") {
                    if (moment(key.next_void).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
                         await _membershipRepository.update(key._id, { must_pay: true, days_without_activity: 0 });
                    }

                    if (String(key.must_pay) === "true") {
                         if (!key.totally_annulled) {
                              await _membershipRepository.update(key._id, { days_without_activity: moment().diff(moment(key.next_void), "days") });
                         }
                         if (key.days_without_activity === 30) {
                              await _membershipRepository.update(key._id, { authorized: "rejected", totally_annulled: true });
                         }
                    }
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
          const member = await _membershipRepository.byClient(id);
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
          const member = await _membershipRepository.byClient(id);
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

     async upgradeMembership(entity) {
          const error = new Error();
          const { plan, email } = entity;
          if (!plan && !email) {
               error.status = 500;
               error.message = "Plan and email are requested to proceed";
               throw error;
          }
          delete entity.plan;
          delete entity.email;
          if (Object.keys(entity).length > 0) {
               error.status = 500;
               error.message = "Just plan and email are accepted in this route";
               throw error;
          }
          const businessExists = await _businessRepository.getBusinessByEmail(email);
          if (!businessExists) {
               error.status = 404;
               error.message = "Business not found";
               throw error;
          }
          const { ruc } = businessExists;
          const valid_plan = Array.from(String(ruc))[0];
          const planexists = Object.keys(Payment.planDictionary).find((v) => {
               return v === plan && v.includes(valid_plan);
          });

          if (!planexists) {
               error.status = 500;
               error.message = "Not a valid plan";
               throw error;
          }

          await _businessRepository.update(businessExists._id, { plan });
          return true;
     }
}

module.exports = MembershipService;
