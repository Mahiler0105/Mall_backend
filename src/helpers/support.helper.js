const codes = {
     FILL_DNI_OWNER: {
          external_verification: false, //SENT TO TEAM
          method: "fillDniOwner",
     },
     CHANGE_OWNER: {
          external_verification: true,
     },
};

module.exports.codesDictionary = codes;
