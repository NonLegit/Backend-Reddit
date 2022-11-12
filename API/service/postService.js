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
    this.selectPostsWithVotes = this.selectPostsWithVotes.bind(this);
    this.setPostOwnerData = this.setPostOwnerData.bind(this);
    this.removeHiddenPosts = this.removeHiddenPosts.bind(this);
    this.setSavedPostStatus = this.setSavedPostStatus.bind(this);
    this.setHiddenPostStatus = this.setHiddenPostStatus.bind(this);
  }

  async checkFlair(subredditId, flairId) {
    const flairs = (
      await this.subredditRepository.getById(subredditId, "flairs")
    ).flairs;
    if (!flairs || !flairs.includes(flairId)) return false;
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
      if (data.flair && !(await this.checkFlair(data.owner, data.flair)))
        return {
          status: "fail",
          statusCode: 400,
          err: "Invalid flair Id",
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

  //Assumed postId is a valid id
  async isAuthor(postId, userId) {
    //const author = (await this.Post.findById(postId).select("author")).author;
    const author = (await this.postRepository.getById(postId, "author")).author;
    return author.equals(userId);
  }

  async isEditable(postId) {
    //const post = await this.Post.findById(postId).select("kind sharedFrom");
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
  /**
   * @property {Function} getUserPosts get posts which created by user
   * @param {string} author - creator id of post
   * @param {string} sortType - sorting posts according to new , top, Hot
   * @returns {Array<object>} - list of posts
   */
  async getUserPosts(author, sortType) {
    if (sortType === "Hot") {
      // algorithm
    } else if (sortType === "Top") {
      // sort by votes
      console.log("Top");
      const posts = await this.postRepository.getAll(
        { author: author },
        { sort: "-votes" },
        "owner"
      );
      return posts.doc;
    } else {
      // sort by createdAt
      const posts = await this.postRepository.getAll(
        { author: author },
        "",
        "owner"
      );
      return posts.doc;
    }
  }
  /**
   * @property {Function} setPostOwnerData set data of owner of post which is subreddit or user
   * @param {Array<object>} posts - list of posts
   * @returns {Array<object>} - list of posts
   */
  setPostOwnerData(posts) {
    //let newPosts = Array.from(posts);
    let newPosts = posts;
    for (var i = 0; i < posts.length; i++) {
      try {
        newPosts[i] = newPosts[i].toObject();
      } catch (err) {}
      if (posts[i].ownerType === "User") {
        newPosts[i]["name"] = posts[i].owner.userName;
      } else {
        newPosts[i]["name"] = posts[i].owner.name;
      }
      newPosts[i]["owner"] = posts[i].owner._id;
    }
    return newPosts;
  }
  /**
   * @property {Function} removeHiddenPosts remove hidden posts from users posts
   * @param {object} user - authenticated user model
   * @param {Array<object>} posts - list of posts
   * @returns {Array<object>} - list of posts
   */
  removeHiddenPosts(user, posts) {
    let hash = {};
    let newPosts = [];
    for (var i = 0; i < user.hidden.length; i++) {
      hash[user.hidden[i]] = user.hidden[i];
    }
    for (var i = 0; i < posts.length; i++) {
      try {
        posts[i] = posts[i].toObject();
      } catch (err) {}
      if (hash[posts[i]._id]) {
        posts[i] = undefined;
      } else {
        posts[i]["isHidden"] = false;
        newPosts.push(posts[i]);
      }
    }
    return newPosts;
  }
  /**
   * @property {Function} setSavedPostStatus set saved status of posts done by user
   * @param {object} user - authenticated user model
   * @param {Array<object>} posts - list of posts
   * @returns {Array<object>} - list of posts
   */
  setSavedPostStatus(user, posts) {
    let newPosts = Array.from(posts);
    let hash = {};
    for (var i = 0; i < user.saved.length; i++) {
      hash[user.saved[i]] = user.saved[i];
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newPosts.length; i++) {
      try {
        newPosts[i] = newPosts[i].toObject();
      } catch (err) {}
      if (hash[posts[i]._id]) {
        newPosts[i]["isSaved"] = true;
        //Object.assign(newPosts[i], {postVoteStatus: "0"});
      } else {
        newPosts[i]["isSaved"] = false;
        //Object.assign(newPosts[i], {postVoteStatus: hash[posts[i]._id]});
      }
    }
    return newPosts;
  }
  /**
   * @property {Function} setHiddenPostStatus set hidden status of posts done by user.
   * @param {object} user - authenticated user model
   * @param {Array<object>} posts - list of posts
   * @returns {Array<object>} - list of posts
   */
  setHiddenPostStatus(user, posts) {
    let newPosts = Array.from(posts);
    let hash = {};
    for (var i = 0; i < user.hidden.length; i++) {
      hash[user.hidden[i]] = user.hidden[i];
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newPosts.length; i++) {
      try {
        newPosts[i] = newPosts[i].toObject();
      } catch (err) {}
      if (hash[posts[i]._id]) {
        newPosts[i]["isHidden"] = true;
        newPosts[i]["isSaved"] = false;
        //Object.assign(newPosts[i], {postVoteStatus: "0"});
      } else {
        newPosts[i]["isHidden"] = false;
        //Object.assign(newPosts[i], {postVoteStatus: hash[posts[i]._id]});
      }
    }
    return newPosts;
  }
  /**
   * @property {Function} setVotePostStatus  set vote status of posts done by user
   * @param {object} user - authenticated user model
   * @param {Array<object>} posts - list of posts
   * @returns {Array<object>} - list of posts
   */
  setVotePostStatus(user, posts) {
    // create map of posts voted by user
    let newPosts = Array.from(posts);
    let hash = {};
    for (var i = 0; i < user.votePost.length; i++) {
      hash[user.votePost[i].posts] = user.votePost[i].postVoteStatus;
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newPosts.length; i++) {
      try {
        newPosts[i] = newPosts[i].toObject();
      } catch (err) {}
      if (!hash[posts[i]._id]) {
        newPosts[i]["postVoteStatus"] = "0";
        //Object.assign(newPosts[i], {postVoteStatus: "0"});
      } else {
        newPosts[i]["postVoteStatus"] = hash[posts[i]._id];
        //Object.assign(newPosts[i], {postVoteStatus: hash[posts[i]._id]});
      }
    }
    return newPosts;
  }
  /**
   * @property {Function} selectPostsWithVotes filter posts according to votetype
   * @param {Array<object>} posts  - list of posts
   * @param {string} votetype - upvoted "!" or downvoted "-1"
   * @returns {Array<object>} - list of posts
   */
  selectPostsWithVotes(posts, votetype) {
    let newPost = [];
    posts.forEach((element) => {
      if (element.postVoteStatus === votetype) {
        let newElement;
        try {
          newElement = element.posts.toObject();
        } catch (err) {}
        newElement["postVoteStatus"] = votetype;
        newPost.push(newElement);
      }
    });
    return newPost;
  }
}

module.exports = PostService;
