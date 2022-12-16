//const Post = require("../models/postModel");
const Repository = require("./repository");
const { mongoErrors ,decorateError, userErrors} = require("../error_handling/errors");
const APIFeatures = require("./apiFeatures");

class NotificationRepository extends Repository {
    constructor({ Notification }) {
        super(Notification);
    }
    
    //user,comment,post
    async addReplyNotification(user, comment, post) {
        try {
            let data;
            let typeOfReply = (comment.type == "Post") ? "postReply" : 'commentReply';
       //     console.log(post);
            if (!post.subreddit) {
                data = {
                    type: typeOfReply,
                    followerUser: {
                        _id: user._id,
                        userName: user.userName,
                        profilePicture: user.profilePicture
                    },
                    followedUser: {
                        _id: post.author._id,
                        userName: post.author.userName
                        
                    },
                    comment: {
                        _id: comment._id,
                        text: comment.text
                    },
                    post: post._id
                };
            } else {
                data = {
                    type: typeOfReply,
                    followerUser: {
                        _id: user._id,
                        userName: user.userName,
                        profilePicture: user.profilePicture
                    },
                    followedSubreddit: {
                        _id: post.subreddit._id,
                        fixedName: post.subreddit.fixedName
                    },
                    comment: {
                        _id: comment._id,
                        text: comment.text
                    },
                    followedUser: {
                        _id: post.author._id
                        
                    },
                    post: post._id
                };
            }
        
            let notification = await this.model.create(data);
            if (!notification)
                return { success: false, error: mongoErrors.UNKOWN };
            
        
        
            //notify ba2a
            return { success: true, doc: notification };
            
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
            
       
    }




    async addFollowNotification(follower,followed) {
        try {
           
            let data = {
                type: "follow",
                followerUser: {
                    _id: follower._id,
                    userName: follower.userName,
                    profilePicture: follower.profilePicture
                },
                followedUser: {
                    _id: followed._id,
                    userName: followed.userName
                        
                }
            };
            let notification = await this.model.create(data);
           // console.log(notification);
            if (!notification)
                return { success: false, error: mongoErrors.UNKOWN };     
            //notify ba2a
            return { success: true, doc: notification };
            
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }     
    }

    async getAllNotifications(userId) {
        try {
            let notifications = await this.model.find({ "followedUser._id": userId ,hidden:false}).sort("-createdAt").limit(10);
            // console.log(notifications);
            if (!notifications) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true, doc: notifications };
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
    }
    async markAllNotificationsAsRead(userId) {
        try {
            let notifications = await this.model.updateMany({ "followedUser._id": userId }, { seen: true });
            //  console.log(notifications);
            if (!notifications) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true };
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
    }

     async markNotificationAsRead(userId,notificationId) {
        try {
            let notification = await this.model.updateOne({ "followedUser._id": userId ,"_id":notificationId}, { seen: true });
             //console.log(notification);
            if (!notification||notification.matchedCount==0) {
                // console.log("hhh");
                return { success: false, error: mongoErrors.NOT_FOUND};
            }
            return { success: true };
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
    }

       async hideNotification(userId,notificationId) {
        try {
            let notification = await this.model.updateOne({ "followedUser._id": userId ,"_id":notificationId}, { hidden: true });
            //  console.log(notification);
            if (!notification||notification.matchedCount==0) {
                // console.log("hhh");
                return { success: false, error: mongoErrors.NOT_FOUND};
            }
            return { success: true };
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
