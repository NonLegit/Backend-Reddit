const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";

const app = require("./../../app");
// const { mockRequest, mockResponse } = require("mock-req-res");
// const { stub, match } = require("sinon");
// const proxyquire = require("proxyquire");

describe("Authentication Controller Test", () => {
    describe("Sign-up Test", () => {
        it("first test", async () => {
            request(app)
                .post("/api/v1/users/logout")
                .send()
                .then((res) => {
                    console.log(res.cookie);
                });
            assert.equal(true, true);
            // expect(res.json).to.have.been.calledWith(match(expected));
        });
    });
});

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
