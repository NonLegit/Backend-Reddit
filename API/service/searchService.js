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

  async search(q, type, page, limit, sort, time, currentUser) {
    const { subscribed, _id, meUserRelationship, userMeRelationship } =
      currentUser;

    q.replace(/"/g, '\\"'); //For phrase searching quotes must be escaped

    let result;
    switch (type) {
      case "posts":
        result = await this.postRepo.search(q, page, limit, sort, time);
        
        result.forEach((post) => {
          const { author, owner, ownerType } = post;
          if (post.ownerType === "User") delete post.owner;
          if (!author.profilePicture.startsWith(process.env.BACKDOMAIN))
            author.profilePicture =
              `${process.env.BACKDOMAIN}/` + author.profilePicture;
          if (post.owner && !owner.icon.startsWith(process.env.BACKDOMAIN))
            owner.icon = `${process.env.BACKDOMAIN}/` + owner.icon;
        });
        break;
      case "communities":
        result = await this.subredditRepo.search(q, page, limit);
        result.forEach((sr) => {
          sr.icon = `${process.env.BACKDOMAIN}/` + sr.icon;
          if (subscribed.includes(sr._id)) sr.isJoined = true;
          else sr.isJoined = false;
        });
        break;
      case "people":
        result = await this.userRepo.search(q, page, limit, _id);

        const userStatus = new Map();
        meUserRelationship.forEach((user) => {
          userStatus.set(user.userId.toString(), user.status);
        });
        userMeRelationship.forEach((user) => {
          if (user.status === "blocked")
            userStatus.set(user.userId.toString(), user.status);
        });

        result = result.filter(
          (user) => userStatus.get(user._id.toString()) !== "blocked"
        );

        result.forEach((user) => {
          user.profilePicture =
            `${process.env.BACKDOMAIN}/` + user.profilePicture;
          if (userStatus.get(user._id.toString()) === "followed") {
            user.isFollowed = true;
          } else user.isFollowed = false;
        });
        break;
    }
    return result;
  }
}

module.exports = CommentService;
