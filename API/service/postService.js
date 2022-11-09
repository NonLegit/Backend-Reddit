class PostService {
  constructor(Post, postRepository, subredditRepository, flairRepository) {
    this.Post = Post;
    this.postRepository = postRepository;
    this.subredditRepository = subredditRepository;

    this.createPost = this.createPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.checkFlair = this.checkFlair.bind(this);
    this.getUserPosts = this.getUserPosts.bind(this);
    this.setVotePostStatus = this.setVotePostStatus.bind(this);
  }

  async checkFlair(subredditId, flairId){
    const flairs = (await this.subredditRepository.getById(subredditId, "flairs")).flairs;
    if(!flairs || !flairs.includes(flairId)) return false;
    return true;
  }

  async createPost(data) {
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

      //validate owner id
      if (data.ownerType === "User") {
        if (!data.author.equals(data.owner))
          return {
            status: "fail",
            statusCode: 400,
            err: "Author id must be the same as Owner id",
          };
      }
      //validate subreddit if the post is created in one
      else {
        if (!(await this.subredditRepository.isValidId(data.owner)))
          return {
            status: "fail",
            statusCode: 404,
            err: "Subreddit not found",
          };
      }
      //validate flair id and make sure it's withing the subreddit
      if (data.flair && !await this.checkFlair(data.owner, data.flair))
        return{
          status: "fail",
          statusCode: 400,
          err: "Invalid flair Id"
        };
        
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

  //Assumes postId is a valid id
  async isAuthor(postId, userId) {
    const author = (await this.postRepository.getById(postId, "author")).author;
    return author.equals(userId);
  }

  //Assumes postId is a valid id
  async isEditable(postId) {
    const post = await this.postRepository.getById(postId, "kind sharedFrom");
    if (post.kind !== "self" || post.sharedFrom) return false;
    return true;
  }

  async updatePost(id, data, userId) {
    try {
      const validId = await this.postRepository.isValidId(id);
      if (!validId)
        return {
          status: "fail",
          statusCode: 404,
          err: "Post not found",
        };
      if (!(await this.isAuthor(id, userId))) {
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

  async deletePost(id, userId) {
    try {
      const validId = await this.postRepository.isValidId(id);
      if (!validId)
        return {
          status: "fail",
          statusCode: 404,
          err: "Post not found",
        };
      if (!(await this.isAuthor(id, userId))) {
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
