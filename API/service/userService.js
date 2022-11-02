//const User = require('../models/userModel');
//const Repository = require('../data_access/repository');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class UserService {
    constructor(User, UserRepository, emailServices) {
        this.User = User; // can be mocked in unit testing
        this.userRepository = UserRepository; // can be mocked in unit testing
        this.emailServices = emailServices;
        this.createUser = this.createUser.bind(this);
        this.createToken = this.createToken.bind(this);
        this.signUp = this.signUp.bind(this);
        this.logIn = this.logIn.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.forgotUserName = this.forgotUserName.bind(this);
    }
    async createUser(data) {
        try {
            let user = await this.userRepository.createOne(data);
            return user;
        } catch (err) {
            console.log("catch error here" + err);
            const error = {
                status: "fail",
                statusCode: 400,
                err,
            };
            return error;
        }
    }
    createToken(id) {
        // what to put in token ?
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return token;
    }
    async signUp(email, userName, password) {
        const userData = {
            email: email,
            userName: userName,
            password: password,
        };
        let user = await this.userRepository.createOne(userData);
        if (user.status === "fail") {
            // user with this email or username is exists
            const response = {
                status: 400,
                body: {
                    errorMessage: "User already Exists",
                },
            };
            return response;
        } else {
            const token = this.createToken(user.doc._id);
            const response = {
                status: 201,
                body: {
                    token: token,
                },
            };
            return response;
        }
    }
    async logIn(userName, password) {
        let user = await this.userRepository.getOne(
            { userName: userName },
            "+password",
            ""
        );
        if (user.status === "fail") {
            const response = {
                status: 400,
                body: {
                    errorMessage: "Invalid username or password",
                },
            };
            return response;
        } else {
            if (await user.doc.checkPassword(password, user.doc.password)) {
                const token = this.createToken(user.doc._id);
                const response = {
                    status: 200,
                    body: {
                        token: token,
                    },
                };
                return response;
            } else {
                const response = {
                    status: 400,
                    body: {
                        errorMessage: "Invalid username or password",
                    },
                };
                return response;
            }
        }
    }
    async forgotUserName(email) {
        try {
            let user = await this.userRepository.getOne(
                { email: email },
                "",
                ""
            );
            if (user.statusCode === 200) {
                await this.emailServices.sendUserName(user.doc);
                const response = {
                    status: 204,
                    body: {
                        status: "success",
                    },
                };
                return response;
            } else {
                const response = {
                    status: 404,
                    body: {
                        errorMessage: "User Not Found",
                    },
                };
                return response;
            }
        } catch (err) {
            console.log("catch error : " + err);
            const error = {
                status: 400,
                body: {
                    errorMessage: err,
                },
            };
            return error;
        }
    }
    async forgotPassword(userName, email) {
        try {
            const query = {
                userName: userName,
                email: email,
            };
            let user = await this.userRepository.getOne(query, "");

            if (user.statusCode === 200) {
                const resetToken = user.doc.createPasswordResetToken();
                await user.doc.save({ validateBeforeSave: false });
                const resetURL = `${process.env.FRONTDOMAIN}resetPassword/${resetToken}`;
                await this.emailServices.sendPasswordReset(user.doc, resetURL);
                const response = {
                    status: 204,
                    body: {
                        status: "success",
                    },
                };
                return response;
            } else {
                const response = {
                    status: 404,
                    body: {
                        errorMessage: "User Not Found",
                    },
                };
                return response;
            }
        } catch (err) {
            console.log("catch error:" + err);
            const error = {
                status: 400,
                body: {
                    errorMessage: err,
                },
            };
            return error;
        }
    }
}
//export default UserService;
module.exports = UserService;
