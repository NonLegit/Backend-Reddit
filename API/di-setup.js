const awilix = require("awilix");

// Require Controllers
const UserController = require("./controllers/userController");
const AuthenticationController = require("./controllers/AuthenticationController");
const PostController = require("./controllers/postController");

// Require Services
const UserService = require("./service/userService");
const Email = require("./service/emailService");
const PostService = require("./service/postService");
// Require Data access
const Repository = require("./data_access/repository");

//Require Models
const User = require("./models/userModel");
const Post = require("./models/postModel");

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
  container.register({
    // controllers
    AuthenticationController: awilix.asClass(AuthenticationController),
    UserController: awilix.asClass(UserController),
    PostController: awilix.asClass(PostController),

    // services
    Email: awilix.asClass(Email),
    UserService: awilix.asClass(UserService),
    PostService: awilix.asClass(PostService),

    // DAOs
    Repository: awilix.asClass(Repository),
    // inject knexjs object with database connection pooling
    // support
    User: awilix.asValue(User),
    Post: awilix.asValue(Post),
  });
}

module.exports = {
  container,
  setup,
};
