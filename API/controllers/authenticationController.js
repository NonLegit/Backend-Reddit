class AuthenticationController {
    constructor(UserServices) {
        this.UserServices = UserServices; // can be mocked in unit testing
        this.forgetPassword = this.forgetPassword.bind(this);
    }

    async forgetPassword(req, res, next) {
        const email = req.body.email;
        const userName = req.body.userName;
        if (!userName || !email) {
            // Bad Request , Send APP Error in error handling class , TODO: error-handeling
            res.status(400).json({
                errorMessage: "Provide username and email",
            });
        } else {
            console.log(this.UserServices);
            console.log("Enter userservices");
            const response = await this.UserServices.forgetPassword(
                userName,
                email
            );
            res.status(response.status).json(response.body);
        }
    }
}
//export default AuthenticationController;
module.exports = AuthenticationController;
