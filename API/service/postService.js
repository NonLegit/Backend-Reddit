const {
  postErrors,
  mongoErrors,
  postActions,
} = require("../error_handling/errors");
const UserService = require("./userService");

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
  constructor({ PostRepository, SubredditRepository, UserRepository }) {
    this.postRepo = PostRepository;
    this.subredditRepo = SubredditRepository;
    this.UserRepository = UserRepository;
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
    //const post = await this.postRepo.findById(id, "author kind sharedFrom");
    const post = await this.postRepo.exists(id);
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
    //const post = await this.postRepo.findById(id, "author kind sharedFrom");
    const post = await this.postRepo.exists(id);
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
    //If the post is shared kind doesn't have to be specified
    const validType =
      data.sharedFrom ||
      (data.kind === "link" && data.url) ||
      (data.kind === "self" && data.text) ||
      data.kind === "image" ||
      data.kind === "video";

    if (!validType)
      return { success: false, error: postErrors.INVALID_POST_KIND };

    //To avoid invalid data in case of image/video posts
    delete data.images;
    delete data.video;

    if (data.ownerType === "User") {
      data.owner = data.author;
      if (data.flairId) delete data.flairId;
    } else if (data.ownerType === "Subreddit") {
      if (!data.owner)
        return { success: false, error: postErrors.INVALID_OWNER };
      const subreddit = await this.subredditRepo.findById(
        data.owner,
        "flairIds allowImgs allowVideos allowLinks"
      );
      if (!subreddit.success)
        return { success: false, error: postErrors.SUBREDDIT_NOT_FOUND };

      if (
        (data.kind === "image" && !subreddit.doc.allowImgs) ||
        (data.kind === "video" && !subreddit.doc.allowVideos) ||
        (data.kind === "link" && !subreddit.doc.allowLinks)
      )
        return { success: false, error: postErrors.INVALID_POST_KIND };

      if (data.flairId && !subreddit.doc.flairIds.includes(data.flairId)) {
        return { success: false, error: postErrors.FLAIR_NOT_FOUND };
      }
    } else return { success: false, error: postErrors.INVALID_OWNER };

    if (data.sharedFrom) {
      const parentPost = await this.postRepo.findById(data.sharedFrom);
      if (!parentPost.success)
        return { success: false, error: postErrors.INVALID_PARENT_POST };

      //parent is inherited
      if (parentPost.doc.sharedFrom)
        data.sharedFrom = parentPost.doc.sharedFrom;

      //This data is meaningless in share case
      // delete data.text;
      // delete data.url;

      data.kind = parentPost.doc.kind;
    }

    data.createdAt = Date.now();
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
          icon: `${process.env.BACKDOMAIN}/` + owner.profilePicture,
        };
      } else {
        newPosts[i]["owner"] = {
          _id: owner._id,
          name: owner.fixedName,
          icon: owner.icon,
        };
      }

      newPosts[i]["author"] = {
        _id: author._id,
        name: author.userName,
      };

      if (posts[i].sharedFrom) {
        let sharedOwner = {};
        if (newPosts[i].sharedFrom.ownerType === "User") {
          sharedOwner["_id"] = newPosts[i].sharedFrom.owner._id;
          sharedOwner["name"] = newPosts[i].sharedFrom.owner.userName;
          sharedOwner["icon"] =
            `${process.env.BACKDOMAIN}/` +
            newPosts[i].sharedFrom.owner.profilePicture;
        } else {
          sharedOwner["_id"] = newPosts[i].sharedFrom.owner._id;
          sharedOwner["name"] = newPosts[i].sharedFrom.owner.fixedName;
          sharedOwner["icon"] = newPosts[i].sharedFrom.owner.icon;
        }
        newPosts[i].sharedFrom.owner = sharedOwner;

        let sharedAuthor = {};
        sharedAuthor["_id"] = newPosts[i].sharedFrom.author._id;
        sharedAuthor["name"] = newPosts[i].sharedFrom.author.userName;
        sharedAuthor["icon"] =
          `${process.env.BACKDOMAIN}/` +
          newPosts[i].sharedFrom.author.profilePicture;

        newPosts[i].sharedFrom["author"] = sharedAuthor;
      }
    }

    return newPosts;
  }
  /**
   * get posts
   * @param {String} query query to apply
   * @param {Object} filter filtering object to filter the posts
   * @returns {Object} object containing array of posts
   */
  async getPosts(query, filter, me, sortType, people) {
    const posts = await this.postRepo.getPosts(
      filter,
      query,
      sortType,
      me,
      people
    );

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
  async getUserPosts(author, sortType, limit, page) {
    if (sortType === "Hot") {
      // algorithm
      //console.log("Hot");

      const posts = await this.postRepo.getUserPosts(
        author,
        { sort: "-sortOnHot", limit: limit, page: page },
        "owner"
      );
      return posts.doc;
    } else if (sortType === "Top") {
      // sort by votes
      //console.log("Top");
      const posts = await this.postRepo.getUserPosts(
        author,
        { sort: "-votes", limit: limit, page: page },
        "owner"
      );
      return posts.doc;
    } else {
      // sort by createdAt
      console.log(limit, page);
      const posts = await this.postRepo.getUserPosts(
        author,
        { sort: "-createdAt", limit: limit, page: page },
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
    //console.log(posts);
    let newPosts = posts;
    let owner = {};
    for (var i = 0; i < posts.length; i++) {
      owner = {};
      try {
        newPosts[i] = newPosts[i].toObject();
        //console.log(newPosts[i]);
      } catch (err) {}
      if (posts[i].sharedFrom) {
        let sharedOwner = {};
        if (newPosts[i].sharedFrom.ownerType === "User") {
          sharedOwner["_id"] = newPosts[i].sharedFrom.owner._id;
          sharedOwner["name"] = newPosts[i].sharedFrom.owner.userName;
          sharedOwner["icon"] =
            `${process.env.BACKDOMAIN}/` +
            newPosts[i].sharedFrom.owner.profilePicture;
        } else {
          sharedOwner["_id"] = newPosts[i].sharedFrom.owner._id;
          sharedOwner["name"] = newPosts[i].sharedFrom.owner.fixedName;
          sharedOwner["icon"] = newPosts[i].sharedFrom.owner.icon;
        }
        newPosts[i].sharedFrom.owner = sharedOwner;
      }
      if (posts[i].ownerType === "User") {
        console.log(i);
        owner["_id"] = posts[i].owner._id;
        owner["name"] = posts[i].owner.userName;
        owner["icon"] =
          `${process.env.BACKDOMAIN}/` + posts[i].owner.profilePicture;
        newPosts[i]["name"] = posts[i].owner.userName;
      } else {
        owner["_id"] = posts[i].owner._id;
        owner["name"] = posts[i].owner.fixedName;
        owner["icon"] = posts[i].owner.icon;
        newPosts[i]["name"] = posts[i].owner.fixedName;
      }

      newPosts[i]["owner"] = owner;
    }
    let author = {};
    for (var i = 0; i < posts.length; i++) {
      author["_id"] = posts[i].author._id;
      author["name"] = posts[i].author.userName;
      author["icon"] =
        `${process.env.BACKDOMAIN}/` + posts[i].author.profilePicture;

      newPosts[i]["author"] = author;
      if (posts[i].sharedFrom) {
        let sharedAuthor = {};
        sharedAuthor["_id"] = newPosts[i].sharedFrom.author._id;
        sharedAuthor["name"] = newPosts[i].sharedFrom.author.userName;
        sharedAuthor["icon"] =
          `${process.env.BACKDOMAIN}/` +
          newPosts[i].sharedFrom.author.profilePicture;

        newPosts[i].sharedFrom["author"] = sharedAuthor;
      }
    }
    //console.log(newPosts)
    newPosts = newPosts.filter(function (item) {
      return !item.isDeleted;
    });
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
      //console.log(user.saved[i].savedPost);
      // if (user.saved[i].savedType === "Post")
      hash[user.saved[i].savedPost] = user.saved[i].savedPost;
    }
    // for (var i = 0; i < user.saved.length; i++) {
    //   hash[user.saved[i]] = user.saved[i];
    // }

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
    console.log("hidden ", user.hidden);
    for (var i = 0; i < user.hidden.length; i++) {
      hash[user.hidden[i]] = user.hidden[i];
      if (user.hidden[i]._id) hash[user.hidden[i]._id] = user.hidden[i]._id;
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newPosts.length; i++) {
      try {
        newPosts[i] = newPosts[i].toObject();
      } catch (err) {}
      if (hash[posts[i]._id]) {
        newPosts[i]["isHidden"] = true;
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
        newPosts[i]["postVoteStatus"] = 0;
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
  async getPost(postId, me) {
    //console.log("inhere");
    let post = await this.postRepo.getPost(postId);
    //   console.log(post);
    //   if (!post.success) {
    //     return { sucess: false, error: postErrors.POST_NOT_FOUND };
    //   }
    //   console.log(post);
    //   return post;
    // }

    // let postInList = [];
    // postInList.push(post.doc);

    if (post.success) {
      if (me == undefined) {
        let postList = this.getPostOwnerAndAuthor(post.doc, me);

        return { success: true, doc: postList[0] };
      } else {
        let postAsArray = [];
        postAsArray.push(post.doc[0].toObject());
        let postList = this.getPostOwnerAndAuthor(postAsArray, me);

        postList = this.setSavedPostStatus(me, postList);
        postList = this.setVotePostStatus(me, postList);
        postList = this.setSpamPostStatus(me, postList);

        return { success: true, doc: postList[0] };
      }
    }
  }

  /**
   * Checks if the user is the post author or moderator in the post subreddit
   * @param {string} postId The post ID
   * @param {string} userId The ID of the user in question
   * @returns {object}
   */
  async isAuthOrMod(postId, userId) {
    const post = await this.postRepo.findById(postId, "author owner ownerType");
    if (!post.success)
      return { success: false, error: postErrors.POST_NOT_FOUND };

    const { author, owner, ownerType } = post.doc;

    if (author.equals(userId)) return { success: true };

    if (ownerType === "Subreddit") {
      const isMod = (await this.subredditRepo.moderator(owner, userId)).success;

      if (isMod) return { success: true };
    }

    return { success: false, error: postErrors.NOT_AUTHOR_OR_MOD };
  }

  /**
   * Checks if the user is the post author
   * @param {string} postId The post ID
   * @param {string} userId The ID of the user in question
   * @returns {object}
   */
  async isAuth(postId, userId, select) {
    const post = await this.postRepo.findById(postId, "author " + select);
    if (!post.success)
      return { success: false, error: postErrors.POST_NOT_FOUND };

    const { author } = post.doc;
    if (!author.equals(userId))
      return { success: false, error: postErrors.NOT_AUTHOR };

    return { success: true, data: post.doc };
  }

  async addFile(postId, kind, file) {
    if (kind === "image") return await this.postRepo.addImage(postId, file);
    else return await this.postRepo.addVideo(postId, file);
  }

  /**
   * Checks if the user is moderator in the post subreddit
   * @param {string} postId The post ID
   * @param {string} userId The ID of the user in question
   * @returns {object}
   */
  async isMod(postId, userId) {
    const post = await this.postRepo.findById(postId, "owner ownerType");
    if (!post.success)
      return { success: false, error: postErrors.POST_NOT_FOUND };

    const { owner, ownerType } = post.doc;

    if (ownerType !== "Subreddit")
      return { success: false, error: postErrors.OWNER_NOT_SUBREDDIT };

    const isMod = (await this.subredditRepo.moderator(owner, userId)).success;
    if (!isMod) return { success: false, error: postErrors.NOT_MOD };

    return { success: true };
  }

  /**
   * Performs an action on post that requires the user to be either author or mod
   * @param {string} postId The ID of the post
   * @param {string} action The action to be performed
   * @param {bool} dir True for the action, False for its opposite
   * @returns {bool} returns true if the action is performed successfully and false otherwise
   */
  // TODO: mod permissions
  async postAction(postId, action) {
    //If action is positive, dir is true, otherwise dir is false
    const prefix = action.slice(0, 2);
    let dir = true;
    if (prefix === "un") {
      dir = false;
      action = action.slice(2);
    }

    switch (action) {
      case "lock_comments":
        action = "locked";
        break;
      case "mark_nsfw":
        action = "nsfw";
        break;
      case "spoiler":
        action = "spoiler";
        break;
    }
    return await this.postRepo.postAction(postId, action, dir);
  }

  /**
   * Performs an action on post only by the moderators of the subreddit
   * @param {string} postId The ID of the post
   * @param {string} action The action to be performed
   * @returns {bool} returns true if the action is performed successfully and false otherwise
   */
  // TODO: mod permissions
  async modAction(postId, action) {
    return await this.postRepo.modAction(postId, action);
  }

  /**
   * Mark a post as spammed by a non-mod user
   * If spam count exceeded certain threshold the post is marked as spammed
   * @param {String} postId
   * @param {String} userId
   * @param {Number} dir
   * @returns
   */
  async spam(postId, userId, dir) {
    const SPAM_THRESHOLD = 5;

    const post = await this.postRepo.findById(postId, "spammedBy spamCount");

    if (!post.success)
      return { success: false, error: postErrors.POST_NOT_FOUND };

    const { spammedBy, spamCount } = post.doc;
    const spammed = spammedBy.includes(userId);

    if ((dir === 1 && spammed) || (dir === -1 && !spammed))
      return { success: false, error: postErrors.ACTION_ALREADY_DONE };

    await this.postRepo.spam(postId, userId, dir);

    if (spamCount + dir >= SPAM_THRESHOLD)
      await this.postRepo.modAction(postId, "spam");

    return { success: true };
  }
  setVoteStatus(user, saved) {
    let newPosts = Array.from(saved);
    //let newPosts = [];
    let hashPosts = {};
    for (var i = 0; i < user.votePost.length; i++) {
      hashPosts[user.votePost[i].posts] = user.votePost[i].postVoteStatus;
    }
    for (var i = 0; i < newPosts.length; i++) {
      // let filteredPost = {};
      try {
        newPosts[i] = newPosts[i].toObject();
      } catch (err) {}
      if (!hashPosts[saved[i].savedPost._id]) {
        newPosts[i].savedPost.postVoteStatus = 0;
        // filteredPost.postVoteStatus ="0";
        //Object.assign(newPosts[i], {postVoteStatus: "0"});
      } else {
        newPosts[i].savedPost.postVoteStatus =
          hashPosts[saved[i].savedPost._id];
        // filteredPost.postVoteStatus = hashPosts[saved[i].savedPost._id];
        //Object.assign(newPosts[i], {postVoteStatus: hash[posts[i]._id]});
      }
      newPosts[i].savedPost.isSaved = true;
      newPosts[i].savedPost.owner = {
        _id: newPosts[i].savedPost.owner._id,
        name:
          newPosts[i].savedPost.ownerType === "User"
            ? newPosts[i].savedPost.owner.userName
            : newPosts[i].savedPost.owner.fixedName,
        icon:
          newPosts[i].savedPost.ownerType === "User"
            ? `${process.env.BACKDOMAIN}/` +
              newPosts[i].savedPost.owner.profilePicture
            : newPosts[i].savedPost.owner.icon,
      };
      newPosts[i].savedPost.author = {
        _id: newPosts[i].savedPost.author._id,
        name: newPosts[i].savedPost.author.userName,
      };
    }
    newPosts = newPosts.filter(function (item) {
      return !item.savedPost.isDeleted;
    });
    return newPosts.reverse();
  }
  filterPosts(posts, comments) {
    posts = posts.filter(
      (post) =>
        comments.findIndex((comment) => {
          return comment._id.toString() === post._id.toString();
        }) === -1
    );
    return posts;
  }
  async findPostById(postId) {
    let post = await this.postRepo.getPostwithAuthor(postId);
    if (post.success === true) {
      return { success: true, data: post.doc };
    } else {
      return { success: false };
    }
  }

  async addVote(user, postId, voteDir, votesCount, author) {
    let voteNumber = voteDir;
    const index = user.votePost.findIndex((element) => {
      return element.posts.toString() === postId.toString();
    });
    if (index == -1) {
      // make it in query
      user.votePost.push({
        posts: postId,
        postVoteStatus: voteDir,
      });
      // check if vote status is 1 so that increase karma
      if (voteDir === 1) {
        author.postKarma = author.postKarma + 1;
        await author.save();
      }
    } else {
      if (user.votePost[index].postVoteStatus === voteDir) {
        return false;
      } else {
        if (user.votePost[index].postVoteStatus === -1) {
          voteNumber += 1;
        } else if (user.votePost[index].postVoteStatus === 1) {
          voteNumber -= 1;
          // decrease karma here
          author.postKarma = author.postKarma - 1;
          await author.save();
        } else if (voteDir === 1) {
          author.postKarma = author.postKarma + 1;
          await author.save();
        }
        user.votePost[index].postVoteStatus = voteDir;
      }
    }
    // update post votes count
    let post = await this.postRepo.updateVotesCount(
      postId,
      voteNumber + votesCount
    );
    //user.replaceProfileDomain();
    await user.save();
    return true;
  }
  async savePost(user, postId) {
    const index = user.saved.findIndex((element) => {
      return element.savedPost.toString() === postId.toString();
    });
    if (index == -1) {
      user.saved.push({
        savedPost: postId,
      });
    } else {
      return false;
    }
    await user.save();
    return true;
  }
  async unSavePost(user, postId) {
    const index = user.saved.findIndex((element) => {
      return element.savedPost.toString() === postId.toString();
    });
    if (index == -1) {
      return false;
    } else {
      user.saved.pull({ savedPost: postId });
    }
    await user.save();
    return true;
  }
  async hidePost(user, postId) {
    const index = user.hidden.findIndex((element) => {
      return element.toString() === postId.toString();
    });
    if (index == -1) {
      user.hidden.push(postId);
    } else {
      return false;
    }
    await user.save();
    return true;
  }
  async unHidePost(user, postId) {
    const index = user.hidden.findIndex((element) => {
      return element.toString() === postId.toString();
    });
    if (index == -1) {
      return false;
    } else {
      user.hidden.pull(postId);
    }
    await user.save();
    return true;
  }
}

module.exports = PostService;
