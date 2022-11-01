class AuthenticationController {
    constructor(UserServices) {
        this.UserServices = UserServices; // can be mocked in unit testing
        this.forgotPassword = this.forgotPassword.bind(this);
        this.forgotUserName = this.forgotUserName.bind(this);
    }

    async forgotPassword(req, res, next) {
        const email = req.body.email;
        const userName = req.body.userName;
        if (!userName || !email) {
            // Bad Request , Send APP Error in error handling class , TODO: error-handeling
            res.status(400).json({
                errorMessage: "Provide username and email",
            });
        } else {
            const response = await this.UserServices.forgetPassword(
                userName,
                email
            );
            res.status(response.status).json(response.body);
        }
    }

    async forgotUserName(req, res, next) {
        const email = req.body.email;
        if (!email) {
            // Bad Request , Send APP Error in error handling class , TODO: error-handeling
            res.status(400).json({
                errorMessage: "Provide email",
            });
        } else {
            const response = await this.UserServices.forgotUserName(
                email
            );
            res.status(response.status).json(response.body);
        }
    }
}
//export default AuthenticationController;
module.exports = AuthenticationController;
