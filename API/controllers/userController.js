class userController {
    constructor(UserServices) {
        console.log("from controller" + UserServices);
        this.userServices = UserServices; // can be mocked in unit testing
        this.createUser = this.createUser.bind(this);
    }
    async createUser(req, res, next) {
        let data = req.body;
        try {
            let user = await this.userServices.createUser(data);
            if (user.status === "success") {
                res.status(user.statusCode).json({
                    status: user.status,
                    user: user.doc,
                });
            } else {
                res.status(user.statusCode).json({
                    status: user.status,
                    message: user.err,
                });
            }
        } catch (err) {
            console.log("error in userservices " + err);
            res.status(500).json({
                status: "fail",
            });
        }
    }
}
//export default userController;
module.exports = userController;
