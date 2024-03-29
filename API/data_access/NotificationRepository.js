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
            console.log(comment);
       //     console.log(post);
            let followedUserId;
            if (typeOfReply == 'commentReply') {
                console.log("ppppppppppppp");
                followedUserId= comment.parentCommentAuthor;
            } else {
                followedUserId = post.author._id;
            }
            
            if (!post.subreddit) {
                data = {
                    type: typeOfReply,
                    followerUser: {
                        _id: user._id,
                        userName: user.userName,
                        profilePicture: user.profilePicture
                    },
                    followedUser: {
                        _id: followedUserId,
                        userName: post.author.userName
                        
                    },
                    comment: {
                        _id: comment._id,
                        text: comment.text
                    },
                    post: post._id,
                    createdAt:Date.now()
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
                        _id: followedUserId
                        
                    },
                    post: post._id,
                    createdAt:Date.now()
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

     async sendMentions(user, comment, post,mentions) {
        try {
            let data;
           // let typeOfReply = (comment.type == "Post") ? "postReply" : 'commentReply';
       //     console.log(post);
            let listNotifactions = [];
            if (!post.subreddit) {
                for (let i = 0; i < mentions.length; i++) {   
                    console.log(i);
                    if (user._id==mentions[i].userId) {
                        continue;
                    }
                    data = {
                        type: "userMention",
                        followerUser: {
                            _id: user._id,
                            userName: user.userName,
                            profilePicture: user.profilePicture
                        },
                        followedUser: {
                            _id: mentions[i].userId,
                            userName: mentions[i].userName
                        
                        },
                        comment: {
                            _id: comment._id,
                            text: comment.text
                        },
                        post: post._id,
                        createdAt:Date.now()
                    };
                    let notification = await this.model.create(data);
                    listNotifactions.push(notification);
                }
                
            } else {
                for (let i = 0; i < mentions.length; i++) {
                     if (user._id==mentions[i].userId) {
                        continue;
                    }
                    data = {
                        type: "userMention",
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
                            _id: mentions[i].userId,
                        
                        },
                        post: post._id,
                        createdAt:Date.now()
                    };
                     let notification = await this.model.create(data);
                listNotifactions.push(notification);
                }
               
            }
            console.log(listNotifactions);
            console.log("jjjjjjjjjjjjjjjjjjjjjjjjj");
            // if (listNotifactions.length==0)
            //     return { success: false, error: mongoErrors.UNKOWN };
            
            console.log(listNotifactions);
        
            //notify ba2a
            return { success: true, doc: listNotifactions };
            
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
                        
                },
                createdAt:Date.now()
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
