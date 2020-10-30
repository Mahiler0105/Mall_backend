const { BusinessRepository } = require("../../../src/repositories");
const { Business } = require("../../../src/models");
const mockingoose = require("mockingoose").default;
let {
  BusinessModelMock: { businesses, business },
} = require("../../mocks");

describe("Business Repository Test", () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  it("Should return a BUSINESS by Id", async () => {
    const _business = { ...business };
    mockingoose(Business).toReturn(business, "findOne");
    const _businessRepository = new BusinessRepository({ Business });
    const expected = await _businessRepository.get(_business._id);
    expect(JSON.parse(JSON.stringify(expected))).toMatchObject(_business);
  });

  it("Should return a BUSINESS by Email", async () => {
    const _business = { ...business };
    mockingoose(Business).toReturn(business, "findOne");
    const _businessRepository = new BusinessRepository({ Business });
    const expected = await _businessRepository.getBusinessByEmail(
      _business.email,
    );
    expect(JSON.parse(JSON.stringify(expected))).toMatchObject(_business);
  });

  it("Should update an especific BUSINESS by Id", async () => {
    const _business = { ...business };
    mockingoose(Business).toReturn(business, "findOneAndUpdate");
    const _businessRepository = new BusinessRepository({ Business });
    const expected = await _businessRepository.update(business._id, {
      name: "test",
    });
    expect(JSON.parse(JSON.stringify(expected))).toMatchObject(_business);
  });

  it("Should delete an especific BUSINESS by Id", async () => {
    const _business = { ...business };
    mockingoose(Business).toReturn(business, "findOneAndDelete");
    const _businessRepository = new BusinessRepository({ Business });
    const expected = await _businessRepository.delete(business._id);

    expect(JSON.parse(JSON.stringify(expected))).toEqual(_business);
  });
});
