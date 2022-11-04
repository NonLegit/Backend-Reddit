const assert = require("chai").assert;
const { expect } = require("chai");
const { mockRequest, mockResponse } = require("mock-req-res");
const { stub, match } = require("sinon");
const proxyquire = require("proxyquire");

const AuthenticationController = require("./../../controllers/AuthenticationController");
const userServiceObj = {
    signUp: function (email, userName, password) {
        const response = {
            status: 400,
            body: {
                errorMessage: "User already Exists",
            },
        };
        return response;
    },
};
const authenticationControllerObj = new AuthenticationController(
    userServiceObj
);

describe("Authentication Controller Test", () => {
    describe("Sign-up Test", () => {
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
        it("first test", async () => {
            // const req = mockRequest({
            //     body: { email: "", password: "", userName: "" },
            // });

            // await authenticationControllerObj.signUp(req, res);
            // console.log(res);
            assert.equal(true, true);
            // expect(res.json).to.have.been.calledWith(match(expected));
        });
    });
});
