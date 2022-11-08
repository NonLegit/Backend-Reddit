class PostService {
  constructor(Post, postRepository) {
    this.Post = Post;
    this.postRepository = postRepository;
    this.createPost = this.createPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.getUserPosts = this.getUserPosts.bind(this);
    this.setVotePostStatus = this.setVotePostStatus.bind(this);
  }

  async createPost(data, user) {
    try {
      const validType =
        (data.kind === "link" && data.url) ||
        (data.kind === "self" && data.text);

      if (!validType) {
        return {
          status: "fail",
          statusCode: 400,
          err: "Invalid post type",
        };
      }

      //Add current user as author
      data.author = user._id;

      //validate subreddit

      //shared
      //scheduled

      const post = await this.postRepository.createOne(data);
      return post;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }

  async isAuthor(postId, userId) {
    const author = (await this.Post.findById(postId).select("author")).author;
    return author.equals(userId);
  }

  async isEditable(postId) {
    const post = await this.Post.findById(postId).select("kind sharedFrom");
    if (post.kind !== "self" || post.sharedFrom) return false;
    return true;
  }

  async updatePost(id, data, user) {
    try {
      if (!(await this.isAuthor(id, user._id))) {
        return {
          status: "fail",
          statusCode: 401,
          err: "User must be author",
        };
      }
      if (!(await this.isEditable(id))) {
        return {
          status: "fail",
          statusCode: 400,
          err: "Post cannot be edited",
        };
      }
      const post = await this.postRepository.updateOne(id, data);
      return post;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }

  async deletePost(id, user) {
    try {
      if (!(await this.isAuthor(id, user._id))) {
        return {
          status: "fail",
          statusCode: 401,
          err: "User is not post author",
        };
      }
      const deleted = await this.postRepository.deleteOne(id);
      return deleted;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }
  async getUserPosts(author) {
    const posts = await this.postRepository.getAll({ author: author }, "", "");
    return posts.doc;
  }
  setVotePostStatus(user, posts) {
    // create map of posts voted by user

    let hash = {};
    for (var i = 0; i < user.votePost.length; i++) {
      hash[user.votePost[i].posts] = user.votePost[i].postVoteStatus;
    }
    console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < posts.length; i++) {
      posts[i] = posts[i].toObject();
      if (!hash[posts[i]._id]) {
        posts[i]["postVoteStatus"] = "0";
      } else {
        posts[i]["postVoteStatus"] = hash[posts[i]._id];
        Object.assign(posts[i], {postVoteStatus: hash[posts[i]._id]});
      }
    }
    console.log(posts[0].postVoteStatus);
    return posts;
  }
}

module.exports = PostService;
