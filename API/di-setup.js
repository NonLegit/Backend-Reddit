const awilix = require("awilix");

// Require Controllers
const UserController = require("./controllers/userController");
const AuthenticationController = require("./controllers/authenticationController");
const PostController = require("./controllers/postController");
const CommentController = require("./controllers/commentController");
const subredditController = require("./controllers/subredditController");
const FileController = require("./controllers/fileController");
const NotificationController = require("./controllers/notificationController"); /////
const MessageController = require("./controllers/messageController"); /////
const SearchController = require("./controllers/searchController");
// Require Services
const UserService = require("./service/userService");
const Email = require("./service/emailService");
const PostService = require("./service/postService");
const subredditService = require("./service/subredditService");
const CommentService = require("./service/commentService");
const NotificationService = require("./service/notificationService");
const MessageService = require("./service/messageService");
const SearchService = require("./service/searchService");
// Require Data access
//const Repository = require("./data_access/repository");
const UserRepository = require("./data_access/UserRepository");
const CommentRepository = require("./data_access/CommentRepository");
const PostRepository = require("./data_access/PostRepository");
const FlairRepository = require("./data_access/FlairRepository");
const MessageRepository = require("./data_access/MessageRepository");
const SubredditRepository = require("./data_access/SubredditRepository");
const SocialRepository = require("./data_access/SocialRepository");
const NotificationRepository = require("./data_access/NotificationRepository");
//Require Models
const User = require("./models/userModel");
const Post = require("./models/postModel");
const Comment = require("./models/commentModel");
const subreddit = require("./models/subredditModel");
const Message = require("./models/messageModel");
const Flair = require("./models/flairModel");
const Social = require("./models/socialModel");
const Notification = require("./models/notificationModel");
const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
  container.register({
    // controllers
    AuthenticationController: awilix.asClass(AuthenticationController),
    UserController: awilix.asClass(UserController),
    PostController: awilix.asClass(PostController),
    CommentController: awilix.asClass(CommentController),
    subredditController: awilix.asClass(subredditController),
    FileController: awilix.asClass(FileController),
    NotificationController: awilix.asClass(NotificationController),
    MessageController: awilix.asClass(MessageController),
    SearchController: awilix.asClass(SearchController),
    // services
    Email: awilix.asClass(Email),
    UserService: awilix.asClass(UserService),
    PostService: awilix.asClass(PostService),
    subredditService: awilix.asClass(subredditService),
    CommentService: awilix.asClass(CommentService),
    NotificationService: awilix.asClass(NotificationService),
    MessageService: awilix.asClass(MessageService),
    SearchService: awilix.asClass(SearchService),
    // DAOs
    //Repository: awilix.asClass(Repository),
    UserRepository: awilix.asClass(UserRepository),
    CommentRepository: awilix.asClass(CommentRepository),
    PostRepository: awilix.asClass(PostRepository),
    FlairRepository: awilix.asClass(FlairRepository),
    MessageRepository: awilix.asClass(MessageRepository),
    SubredditRepository: awilix.asClass(SubredditRepository),
    SocialRepository: awilix.asClass(SocialRepository),
    NotificationRepository: awilix.asClass(NotificationRepository),

    // inject knexjs object with database connection pooling
    // support
    User: awilix.asValue(User),
    Post: awilix.asValue(Post),
    Comment: awilix.asValue(Comment),
    subreddit: awilix.asValue(subreddit),
    Message: awilix.asValue(Message),
    Flair: awilix.asValue(Flair),
    Social: awilix.asValue(Social),
    Notification: awilix.asValue(Notification),
  });
}

module.exports = {
  container,
  setup,
};
