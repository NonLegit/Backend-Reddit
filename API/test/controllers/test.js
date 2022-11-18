const assert = require("chai").assert;
const expect = require("chai").expect;
const sinonChai = require("sinon-chai");
const chai = require("chai");
const auth = require("./../../controllers/authenticationController");
//const { mockRequest, mockResponse } = require("mock-req-res");
const sinon = require("sinon");
chai.use(sinonChai);
// const proxyquire = require("proxyquire");

//var res = { send: sinon.spy() ,status: sinon.spy(),json: sinon.spy()};
const statusJsonSpy = sinon.spy();
const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};

describe("Authentication Controller Test", () => {
  it("", async () => {

    const req = {
      body: {
        email: "a",
        userName: "b",
        password: "a",
      },
    };
    const UserService = {
      signUp: async (email, password, userName) => {
        const response = {
          status: 201,
          body: {
            token: "1",
          },
        };
        return response;
      },
    };
    const authObj = new auth({ UserService });
    console.log(authObj);
    await authObj.signUp(req, res, "");
    //console.log(res.json());
    expect(res.status).to.have.been.calledWith(201);
    //   expect(res.status).to.have.been.calledWith(400);
    //console.log(res.body);
    //console.log(res.cookie);
  });
});
    // const req = mockRequest({
    //   body: { email: "", password: "", userName: "" },
    // });
    //const res = mockResponse();

//const res = mockResponse();
// const resetStubs = () => {
//   mockSave.resetHistory();
//   res.json.resetHistory();
// };
// const mockSave = stub();

// const res = mockResponse();
// const resetStubs = () => {
//     mockSave.resetHistory();
//     res.json.resetHistory();
// };
// const expected = { name: "", description: "", id: 1 };
// before(() => {
//     //save.returns(expected);
// });
//it

// const req = mockRequest({
//     body: { email: "", password: "", userName: "" },
// });

// await authenticationControllerObj.signUp(req, res);
// console.log(res);
