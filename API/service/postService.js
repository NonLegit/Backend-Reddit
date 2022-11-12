const ObjectId = require("mongodb").ObjectId;

class PostService {
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
    this.selectPostsWithVotes = this.selectPostsWithVotes.bind(this);
  }

  async checkFlair(subredditId, flairId) {
    const flairs = (
      await this.subredditRepository.getById(subredditId, "flairs")
    ).flairs;
    if (!flairs || !flairs.includes(flairId)) return false;
    return true;
  }

  async createPost(data) {
    const post = (await this.postRepository.createOne(data)).doc;
    return post;
  }

  async updatePost(id, data) {
    const post = (await this.postRepository.updateOne({_id: id}, data)).doc;
    return post;
  }

  async deletePost(id) {
    await this.postRepository.updateOne({_id: id}, {isDeleted: true});
  }

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
      if(!data.owner) return false;
      const validSubreddit = await this.subredditRepository.isValidId(
        data.owner
      );
      if (data.ownerType !== "Subreddit" || !validSubreddit) return false;
    }

    // if (data.flair) {
    //   await this.subredditRepository.getById(data.owner, "flairs");
    // }

    //shared
    //scheduled

    return true;
  }

  //Assumes postId is a valid id
  async isAuthor(postId, userId) {
    const author = (await this.postRepository.getById(postId, "author")).author;
    return author.equals(userId);
  }

  async isValidId(id) {
    if (!ObjectId.isValid(id)) return false;
    const doc = await this.postRepository.getById(id, "_id");
    if (!doc) return false;
    return true;
  }

  //Assumes postId is a valid id
  async isEditable(postId) {
    const post = await this.postRepository.getById(postId, "kind sharedFrom");
    if (post.kind !== "self" || post.sharedFrom) return false;
    return true;
  }

  async getUserPosts(author) {
    const posts = await this.postRepository.getAll({ author: author }, "", "");
    return posts.doc;
  }
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
