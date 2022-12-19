/**
 * Comment Service class for handling Comment model and services
 */
class CommentService {
  constructor({
    CommentRepository,
    PostRepository,
    SubredditRepository,
    UserRepository,
  }) {
    this.commentRepo = CommentRepository;
    this.postRepo = PostRepository;
    this.subredditRepo = SubredditRepository;
    this.userRepo = UserRepository;
  }

  async search(q, type, page, limit, sort, time) {
    q.replace(/"/g, '\\"'); //For phrase searching quotes must be escaped

    let result;
    switch (type) {
      case "posts":
        result = await this.postRepo.search(q, page, limit, sort, time);
        break;
      case "communities":
        result = await this.subredditRepo.search(q, page, limit);
        break;
    }
    return result;
  }
}

module.exports = CommentService;
