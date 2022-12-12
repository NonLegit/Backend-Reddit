//const Post = require("../models/postModel");
const Repository = require("./repository");
const { mongoErrors ,decorateError, userErrors} = require("../error_handling/errors");
const APIFeatures = require("./apiFeatures");

class NotificationRepository extends Repository {
  constructor({ Notification }) {
    super(Notification);
    }
    
//user,comment,post
    async addReplyNotification(user,comment,post) {
        try {
            let data;
            let typeOfReply = (comment.type == "Post") ? "postReply" : 'commentReply';
            console.log(post);
            if (!post.subreddit) {
                data = {
                    type: typeOfReply,
                    followerUser : {
                        _id: user._id,
                        userName:user.userName,
                        profilePicture: user.profilePicture
                    },
                    followedUser: {
                        _id: post.author._id,
                        userName: post.author.userName
                        
                    },
                    comment: {
                        _id: comment._id,
                        text:comment.text
                    },
                    post:post._id
                };
            } else {
                data = {
                    type: typeOfReply,
                    followerUser: {
                        _id: user._id,
                        userName:user.userName,
                        profilePicture: user.profilePicture
                    },
                    followedSubreddit: {
                        _id: post.subreddit._id,
                        fixedName: post.subreddit.fixedName
                    },
                    comment: {
                        _id: comment._id,
                        text:comment.text
                    },
                    followedUser: {
                        _id: post.author._id
                        
                    },
                    post:post._id
                };
            }
        
            let notification = await this.model.create(data);
            if (!notification)
                return { success: false, error: mongoErrors.UNKOWN };
            
        
        
            //notify ba2a
            return { success: true, doc: notification  };
            
        } catch (err) {
             return { success: false, ...decorateError(err) };
        }
            
       
    }
    /*
    followedUser	User{...}Jump to definition
followerUser	User{...}Jump to definition
followedSubreddit	fullSubreddit{...}Jump to definition
post	Post{...}Jump to definition
comment
    */

 
}
module.exports = NotificationRepository;
