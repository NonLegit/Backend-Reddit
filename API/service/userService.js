//const User = require('../models/userModel');
//const Repository = require('../data_access/repository');
class UserService {
    constructor(User, UserRepository, emailServices) {
        this.User = User; // can be mocked in unit testing
        this.userRepository = UserRepository; // can be mocked in unit testing
        this.emailServices = emailServices;
        this.createUser = this.createUser.bind(this);
        this.forgetPassword = this.forgetPassword.bind(this);
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
    async forgetPassword(userName, email) {
        try {
            const query = {
                userName: userName,
                email: email,
            };
            let user = await this.userRepository.getOne(query,"");

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
            console.log("catch error here" + err);
            const error = {
                status: 400,
                body: {
                    err,
                },
            };
            return error;
        }
    }
}
//export default UserService;
module.exports = UserService;
