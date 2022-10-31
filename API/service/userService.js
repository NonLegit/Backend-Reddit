//const User = require('../models/userModel');
//const Repository = require('../data_access/repository');
class userService {
    constructor(User, UserRepository) {
        this.User = User; // can be mocked in unit testing
        this.userRepository = UserRepository; // can be mocked in unit testing
        this.createUser = this.createUser.bind(this);
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
}
//export default userService;
module.exports = userService;
