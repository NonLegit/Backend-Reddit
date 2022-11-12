const ObjectId = require("mongodb").ObjectId;

/**
 * Post Service class for handling Post model and services
 */
class PostService {
  /**
   * Post Service constructor
   * Depends on the following classes
   * @param {object} Post - Post data model
   * @param {object} postRepository - Data access object for post
   * @param {object} subredditRepository - Data access object for subreddit
   * @param {object} flairRepository
   */
  constructor(Post, postRepository, subredditRepository, flairRepository) {
    this.Post = Post;
    this.postRepository = postRepository;
    this.subredditRepository = subredditRepository;

    this.createPost = this.createPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.isValidId = this.isValidId.bind(this);
    this.isEditable = this.isEditable.bind(this);
    this.isAuthor = this.isAuthor.bind(this);
    this.isValidPost = this.isValidPost.bind(this);
    this.checkFlair = this.checkFlair.bind(this);
    this.getUserPosts = this.getUserPosts.bind(this);
    this.setVotePostStatus = this.setVotePostStatus.bind(this);

    this.getPosts = this.getPosts.bind(this);
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

  /**
   * Creates a post with the given data
   * @param {object} data  - Post required data before creation
   * @returns {object} - Post object after creation
   */
  async createPost(data) {
    const post = (await this.postRepository.createOne(data)).doc;
    return post;
  }

  /**
   * Updates the text of the post with the given id
   * @param {string} id - Post ID
   * @param {object} data - The post data that shoud be updated namely, text
   * @returns {object} - Post object after update
   */
  async updatePost(id, data) {
    const post = (await this.postRepository.updateOne({ _id: id }, data)).doc;
    return post;
  }

  /**
   * Deletes a Post with the given id
   * Soft-delete is used to ensure data integrity
   * The delete effect is cascaded to all the comment tree of the post using mongoose middlewares
   * @param {string} id - Post ID
   */
  async deletePost(id) {
    await this.postRepository.updateOne({ _id: id }, { isDeleted: true });
  }

  /**
   * Validate the post data request
   * The following conditions are checked
   * - required data is present
   * - the post is of valid kind
   * - the post owner is valid
   * - valid flair id is provided
   * @param {object} data - The post data 
   * @returns {boolean}
   */
  async isValidPost(data) {
    const validReq = data.ownerType && data.kind && data.title;
    if (!validReq) return false;

    const validType =
      (data.kind === "link" && data.url) || (data.kind === "self" && data.text);
    if (!validType) return false;

    //validate that the post is created only on author profile

    if (data.ownerType === "User") {
      data.owner = data.author;
    }
    //validate subreddit if the post is created in one
    else {
      if (!data.owner) return false;
      const validSubreddit = await this.subredditRepository.isValidId(
        data.owner
      );
      if (data.ownerType !== "Subreddit" || !validSubreddit) return false;
    }

    // if (data.flair) {
    //   await this.subredditRepository.getById(data.owner, "flairs");
    // }

    return true;
  }

  /**
   * Checks if the user is the post author
   * assumes postId is valid
   * @param {string} postId
   * @param {string} userId 
   * @returns {boolean}
   */
  async isAuthor(postId, userId) {
    const author = (await this.postRepository.getById(postId, "author")).author;
    return author.equals(userId);
  }

  /**
   * Validates post id
   * @param {string} id - Post id
   * @returns {boolean}
   */
  async isValidId(id) {
    if (!ObjectId.isValid(id)) return false;
    const doc = await this.postRepository.getById(id, "_id");
    if (!doc) return false;
    return true;
  }

  /**
   * Checks if the post with given id can be edited
   * A post can be edited if its kind is self and it's not crossposted
   * @param {string} postId 
   * @returns {boolean}
   */
  async isEditable(postId) {
    const post = await this.postRepository.getById(postId, "kind sharedFrom");
    if (post.kind !== "self" || post.sharedFrom) return false;
    return true;
  }
  /**
   * get posts
   * @param {String} query query to apply
   * @param {Object} filter filtering object to filter the posts
   * @returns {Object} object containing array of posts
   */

  async getPosts(query, filter) {
    try {
      const posts = await this.postRepository.getAll(filter, query);
      console.log(posts);
      return posts;
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
        let newElement = {};
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
