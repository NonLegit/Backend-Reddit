class PostService {
  constructor(Post, postRepository) {
    this.Post = Post;
    this.postRepository = postRepository;
    this.createPost = this.createPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.getUserPosts = this.getUserPosts.bind(this);
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
  async getUserPosts() {}
}

module.exports = PostService;
