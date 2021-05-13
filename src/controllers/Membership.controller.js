let _membershipService = null;

class MembershipController {
     constructor({ MembershipService }) {
          _membershipService = MembershipService;
     }
     async refreshKeys(req, res) {
          const result = await _membershipService.refreshKeys();
          return res.send(result);
     }
     async cancelMembership(req, res) {
          const { body } = req;
          const result = await _membershipService.cancelMembership(body);
          return res.send(result);
     }
     async continueMembership(req, res) {
          const { body } = req;
          const result = await _membershipService.continueMembership(body);
          return res.send(result);
     }
}

module.exports = MembershipController;
