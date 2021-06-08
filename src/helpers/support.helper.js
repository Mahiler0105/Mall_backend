const codes = {
     FILL_DNI_OWNER: {
          external_verification: false, //SEND TO TEAM?
          method: "fillDniOwner",
     },
     CHANGE_OWNER: {
          external_verification: true,
     },
     VERIFY_OWNER_DNI: {
          external_verification: true,
     },
};

module.exports.codesDictionary = codes;
