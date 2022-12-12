const { postErrors, mongoErrors } = require("../error_handling/errors");

/**
 * Post Service class for handling Post model and services
 */
class PostService {
  /**
   * Post Service constructor
   * Depends on the following classes
   * @param {object} PostRepository - Data access object for post
   * @param {object} subredditRepo - Data access object for subreddit
   */
  constructor({ PostRepository, SubredditRepository }) {
    this.postRepo = PostRepository;
    this.subredditRepo = SubredditRepository;
    //this.printo = this.printo.bind(this);
  }

  /**
   * Updates the text of the post with the given id
   * @param {string} id - Post ID
   * @param {object} data - The post data that shoud be updated namely, text
   * @returns {object} - Post object after update
   */
  async updatePost(id, data, userId) {
    //validate post ID
    const post = await this.postRepo.findById(id, "author kind sharedFrom");
    if (!post.success)
      return { success: false, error: postErrors.POST_NOT_FOUND };

    const { author, kind, sharedFrom } = post.doc;

    //validate the user
    if (!author.equals(userId))
      return { success: false, error: postErrors.NOT_AUTHOR };

    //Check if post is editable
    if (kind !== "self" || sharedFrom)
      return { success: false, error: postErrors.NOT_EDITABLE };

    const updatedPost = await this.postRepo.updateText(id, data.text);
    return { success: true, data: updatedPost.doc };
  }

  /**
   * Deletes a Post with the given id
   * Soft-delete is used to ensure data integrity
   * The delete effect is cascaded to all the comment tree of the post using mongoose middlewares
   * @param {string} id - Post ID
   */
  async deletePost(id, userId) {
    //validate post ID
    const post = await this.postRepo.findById(id, "author");
    if (!post.success)
      return { success: false, error: postErrors.POST_NOT_FOUND };

    const author = post.doc.author;

    //validate the user
    if (!author.equals(userId))
      return { success: false, error: postErrors.NOT_AUTHOR };

    await this.postRepo.deletePost(id);

    return { success: true };
  }

  /**
   * Creates a post after validation
   * The following conditions are checked
   * - required data is present
   * - the post is of valid kind
   * - the post owner is valid
   * - valid flair id is provided
   * @param {object} data  - Post required data before creation
   * @returns {object}
   */
  async createPost(data) {
    const validType =
      (data.kind === "link" && data.url) || (data.kind === "self" && data.text);
    if (!validType)
      return { success: false, error: postErrors.INVALID_POST_KIND };

    if (data.ownerType === "User") {
      data.owner = data.author;
      if (data.flairId) delete data.flairId;
    }
    //validate subreddit if the post is created in one
    else if (data.ownerType === "Subreddit") {
      if (!data.owner)
        return { success: false, error: postErrors.INVALID_OWNER };
      const subreddit = await this.subredditRepo.findById(
        data.owner,
        "flairIds"
      );
      if (!subreddit.success)
        return { success: false, error: postErrors.SUBREDDIT_NOT_FOUND };

      if (data.flairId && !subreddit.doc.flairIds.includes(data.flairId)) {
        return { success: false, error: postErrors.FLAIR_NOT_FOUND };
      }
    } else return { success: false, error: postErrors.INVALID_OWNER };

    const post = await this.postRepo.createOne(data);
    if (post.success) return { success: true, data: post.doc };

    return { success: false, error: postErrors.MONGO_ERR, msg: post.msg };
  }

  getPostOwnerAndAuthor(posts, me) {
    //let newPosts = Array.from(posts);

    // let newPosts = (!me)?Array.from(posts):posts;
    let newPosts = !me ? [] : posts;
    for (var i = 0; i < posts.length; i++) {
      if (!me) newPosts.push(posts[i].toObject());

      let owner = { ...posts[i].owner };
      let author = { ...posts[i].author };
      if (!me) {
        owner = owner._doc;
        author = author._doc;
      }

      delete newPosts[i].owner;
      delete newPosts[i].author;

      if (posts[i].ownerType === "User") {
        newPosts[i]["owner"] = {
          _id: owner._id,
          name: owner.userName,
          icon: `${process.env.BACKDOMAIN}/`+owner.profilePicture,
        };
        console.log(newPosts[i]);
      } else {
        newPosts[i]["owner"] = {
          _id: owner._id,
          name: owner.fixedName,
          icon:  `${process.env.BACKDOMAIN}/` +owner.icon
        };
      }

      newPosts[i]["author"] = {
        _id: author._id,
        name: author.userName,
      };
    }

    return newPosts;
  }
  /**
   * get posts
   * @param {String} query query to apply
   * @param {Object} filter filtering object to filter the posts
   * @returns {Object} object containing array of posts
   */
  async getPosts(query, filter, me, sortType) {
    const posts = await this.postRepo.getPosts(filter, query, sortType);

    if (posts.success) {
      if (posts.doc.length == 0) {
        return { success: true, data: posts.doc };
      } else if (me == undefined) {
        let postList = this.getPostOwnerAndAuthor(posts.doc, me);
        return { success: true, data: postList };
      } else {
        let postList = this.removeHiddenPosts(me, posts.doc);
        postList = this.getPostOwnerAndAuthor(postList, me);
        // postList = this.setSavedPostStatus(me, postList);
        // postList = this.getPostOwnerAndAuthor(postList);
        postList = this.setSavedPostStatus(me, postList);
        postList = this.setVotePostStatus(me, postList);
        postList = this.setSpamPostStatus(me, postList);

        return { success: true, data: postList };
      }
    }

    // if (!posts.success && posts.error)
    //   return { sucess: false, error: posts.error };

    return { sucess: false, error: postErrors.MONGO_ERR, msg: posts.msg };
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
      console.log("Hot");
      const posts = await this.postRepo.getUserPosts(
        author,
        { sort: "-sortOnHot" },
        "owner"
      );
      return posts.doc;
    } else if (sortType === "Top") {
      // sort by votes
      console.log("Top");
      const posts = await this.postRepo.getUserPosts(
        author,
        { sort: "-votes" },
        "owner"
      );
      return posts.doc;
    } else {
      // sort by createdAt
      const posts = await this.postRepo.getUserPosts(author, "", "owner");
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
    console.log(posts);
    let newPosts = posts;
    let owner = {};
    for (var i = 0; i < posts.length; i++) {
      try {
        newPosts[i] = newPosts[i].toObject();
        console.log(newPosts[i]);
      } catch (err) {}
      if (posts[i].ownerType === "User") {
        owner["_id"] = posts[i].owner._id;
        owner["name"] = posts[i].owner.userName;
        owner["icon"] =
          `${process.env.BACKDOMAIN}/` +
          posts[i].owner.profilePicture;
        newPosts[i]["name"] = posts[i].owner.userName;
      } else {
        owner["_id"] = posts[i].owner._id;
        owner["name"] = posts[i].owner.fixedName;
        owner["icon"] =
          `${process.env.BACKDOMAIN}/` + posts[i].owner.icon;
        newPosts[i]["name"] = posts[i].owner.fixedName;
      }

      newPosts[i]["owner"] = owner;
    }
    let author = {};
    for (var i = 0; i < posts.length; i++) {
      author["_id"] = posts[i].author._id;
      author["name"] = posts[i].author.userName;
      author["icon"] =
        `${process.env.BACKDOMAIN}/` +
        posts[i].author.profilePicture;

      newPosts[i]["author"] = author;
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

  setSpamPostStatus(user, posts) {
    let newPosts = Array.from(posts);
    let hash = {};
    for (var i = 0; i < user.spam.length; i++) {
      hash[user.spam[i]] = user.spam[i];
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newPosts.length; i++) {
      try {
        newPosts[i] = newPosts[i].toObject();
      } catch (err) {}
      if (hash[posts[i]._id]) {
        newPosts[i]["isSpam"] = true;
        //Object.assign(newPosts[i], {postVoteStatus: "0"});
      } else {
        newPosts[i]["isSpam"] = false;
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
  async getPost(postId) {
    let post = await this.postRepo.findById(postId);
    console.log(post);
    if (!post.success) {
      return { sucess: false, error: postErrors.POST_NOT_FOUND };
    }

    return post;
  }
}

module.exports = PostService;
