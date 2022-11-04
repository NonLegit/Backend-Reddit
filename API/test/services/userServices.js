const assert = require("chai").assert;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
console.log("secret " + process.env.JWT_SECRET);
const UserService = require("./../../service/userService");

const RepositoryObj = {
    createOne: (userData) => {
        const response = {
            status: "success",
            statusCode: 201,
            doc: {
                _id: "1",
            },
        };
        return response;
    },
};
const emailServiceObj = {
    sendPasswordReset: (user, resetURL) => {
        return true;
    },
};
const userServiceObj = new UserService("", RepositoryObj, emailServiceObj);

describe("Authentication Test", () => {
    describe("Sign-up services Test", () => {
        it("first test (success operation of database)", async () => {
            const RepositoryObj = {
                createOne: (userData) => {
                    const response = {
                        status: "success",
                        statusCode: 201,
                        doc: {
                            _id: "1",
                        },
                    };
                    return response;
                },
            };
            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.signUp("", "", "");
            assert.equal(output.status, 201);
            assert.notEqual(output.body.token, false);
        });
        it("second test(fail operation of database)", async () => {
            const RepositoryObj = {
                createOne: (userData) => {
                    const response = {
                        status: "fail",
                        statusCode: 400,
                        err: "mongoose err",
                    };
                    return response;
                },
            };

            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.signUp("", "", "");
            assert.equal(output.status, 400);
            assert.equal(output.body.errorMessage, "User already Exists");
        });
    });

    describe("Log-in services Test", () => {
        it("first test (success operation of database)", async () => {
            const RepositoryObj = {
                getOne: (userData) => {
                    const response = {
                        status: "success",
                        statusCode: 201,
                        doc: {
                            _id: "1",
                            checkPassword: (password, passwordDB) => {
                                return true;
                            },
                        },
                    };
                    return response;
                },
            };
            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.logIn("", "");
            assert.equal(output.status, 200);
            assert.notEqual(output.body.token, false);
        });
        it("second test(success operation of database but wrong password)", async () => {
            const RepositoryObj = {
                getOne: (userData) => {
                    const response = {
                        status: "success",
                        statusCode: 201,
                        doc: {
                            _id: "1",
                            checkPassword: (password, passwordDB) => {
                                return false;
                            },
                        },
                    };
                    return response;
                },
            };
            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.logIn("", "");
            assert.equal(output.status, 400);
            assert.notEqual(output.body.token, true);
        });
        it("thrid test(fail operation of database)", async () => {
            const RepositoryObj = {
                getOne: (userData) => {
                    const response = {
                        status: "fail",
                        statusCode: 400,
                        err: "mongoose err",
                    };
                    return response;
                },
            };
            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.logIn("", "");
            //console.log(output);
            assert.equal(output.status, 400);
            assert.notEqual(output.body.token, true);
        });
    });

    describe("Forgot-password services Test", () => {
        it("first test (success operation of database)", async () => {
            const RepositoryObj = {
                getOne: (userData) => {
                    const response = {
                        status: "success",
                        statusCode: 200,
                        doc: {
                            _id: "1",
                            save: (password, passwordDB) => {
                                return true;
                            },
                            createPasswordResetToken: () => {
                                return true;
                            },
                        },
                    };
                    return response;
                },
            };
            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.forgotPassword("", "");
            assert.equal(output.status, 204);
        });
        it("second test(success operation of database but  exception occured)", async () => {
            const RepositoryObj = {
                getOne: (userData) => {
                    const response = {
                        status: "success",
                        statusCode: 200,
                        doc: {
                            _id: "1",
                            save: (password, passwordDB) => {
                                return true;
                            },
                        },
                    };
                    return response;
                },
            };
            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.forgotPassword("", "");
            assert.equal(output.status, 400);
        });
        it("thrid test(fao; operation of database)", async () => {
            const RepositoryObj = {
                getOne: (userData) => {
                    const response = {
                        status: "fail",
                        statusCode: 404,
                        doc: {
                            _id: "1",
                            save: (password, passwordDB) => {
                                return true;
                            },
                            createPasswordResetToken: () => {
                                return true;
                            },
                        },
                    };
                    return response;
                },
            };
            const userServiceObj = new UserService(
                "",
                RepositoryObj,
                emailServiceObj
            );
            const output = await userServiceObj.forgotPassword("", "");
            assert.equal(output.status, 404);
            assert.notEqual(output.body.token, false);
        });
    });
});
