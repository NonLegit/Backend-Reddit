const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";
const server = require("./../../server");

const app = require("./../../app");
// const { mockRequest, mockResponse } = require("mock-req-res");
// const { stub, match } = require("sinon");
// const proxyquire = require("proxyquire");

describe("Authentication Controller Test", async () => {
    describe("Sign-up Test", () => {
        it("first test success", (done) => {
            request(app)
                .post("/api/v1/users/signup")
                .send({
                    email: "ahmedsabry@gmail.com",
                    userName: "ahmed",
                    password: "12345678",
                })
                .then((res) => {
                    assert.equal(res.body.status, "success");
                    console.log("Passed from first test in sign");
                    //done();
                })
                .catch((err) => {
                    done(err);
                });

            request(app)
                .post("/api/v1/users/signup")
                .send({
                    email: "ahmedsabry@gmail.com",
                    userName: "ahmed",
                    password: "12345678",
                })
                .then((res) => {
                    assert.equal(res.body.status, "fail");
                    console.log("Passed from first test in sign");
                    done();
                });
        });
        it("second test (fail,not provide all body)", (done) => {
            request(app)
                .post("/api/v1/users/signup")
                .send({
                    email: "ahmed@gmail.com",
                    userName: "ahmedd",
                })
                .then((res) => {
                    assert.equal(res.body.status, "fail");
                    assert.equal(res.status, 400);
                    console.log("Passed from first test in sign");
                });

            request(app)
                .post("/api/v1/users/signup")
                .send({
                    email: "kahled@gmail.com",
                    password: "12345678",
                })
                .then((res) => {
                    assert.equal(res.body.status, "fail");
                    assert.equal(res.status, 400);
                    console.log("Passed from first test in sign");
                    done();
                });
        });
    });

    describe("login Test", () => {
        it("first test success", async () => {
            console.log("make request");
            request(app)
                .post("/api/v1/users/signup")
                .send({
                    email: "ahmed123@gmail.com",
                    userName: "ahmed123",
                    password: "12345678",
                })
                .then((res1) => {
                    console.log(res1.status);
                    request(app)
                        .post("/api/v1/users/login")
                        .send({
                            userName: "ahmed123",
                            password: "12345678",
                        })
                        .then((res) => {
                            console.log(res.body.status);
                            expect(res.body.status).to.equal("success");
                        });
                });
            console.log("end request");
        });
        it("second test (fail,not provide all body)", async () => {
            request(app)
                .post("/api/v1/users/login")
                .send({
                    email: "ahmed@gmail.com",
                    userName: "ahmedd",
                })
                .then((res) => {
                    assert.equal(res.body.status, "fail");
                    assert.equal(res.status, 400);
                });

            request(app)
                .post("/api/v1/users/login")
                .send({
                    email: "kahled@gmail.com",
                    password: "12345678",
                })
                .then((res) => {
                    assert.equal(res.body.status, "fail");
                    assert.equal(res.status, 400);
                });
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
