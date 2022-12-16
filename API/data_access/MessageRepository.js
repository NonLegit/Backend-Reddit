const Repository = require("./repository");
const { mongoErrors ,decorateError, userErrors} = require("../error_handling/errors");
const APIFeatures = require("./apiFeatures");


class MessageRepository extends Repository {
  constructor({ Message }) {
    super(Message);
  }

  async createMessage(userId, message,userToRecieve) {
       try {
             

         let data = {
           text: message.text,
           type: "userMessage",
           from: userId,
           to: userToRecieve,
           subject: {
             text:message.subject
           }
           
         };
            let messageToSend = await this.model.create(data);
         if (!messageToSend) {
          
           return { success: false, error: mongoErrors.UNKOWN };
         }
        
        
            //notify ba2a
            return { success: true, doc: messageToSend };
            
       } catch (err) {
         console.log("nnnnnnnnnnnnnnnnnnnnnnnnnn");
         //console.log(err.errors.subject.text);
            return { success: false, ...decorateError(err) };
        }
            
  }


   async createReplyMessage(user, comment, post) {
     try {
       console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
       let data;
       console.log(user);
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
       console.log(post);
       console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
       console.log(comment);
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
       if (!post.subreddit) {
           
               data = {
                    type: 'postReply',
                    from:  user._id,
            
                   
                    
                    comment: comment._id,
                       
                    to:  post.author._id,
                        
                    
                    post: post._id
         };
           console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
       } else {
          
                data = {
                    type: 'postReply',
                    from:  user._id,
            
                   subreddit:  post.subreddit._id,
                    comment: comment._id,
                       
                    to:  post.author._id,
                        
                    
                    post: post._id
                };
       }
       
       console.log(data);
       let message = await this.model.create(data);
       console.log("comme un enfannt");
       console.log(message);
       console.log("comme un enfannt");
            if (!message)
                return { success: false, error: mongoErrors.UNKOWN };
            
        
        
            //notify ba2a
            return { success: true, doc: message };
            
     } catch (err) {
       console.log(err);
            return { success: false, ...decorateError(err) };
        }
            
       
    }


    async getSentMessage(userId,query) {
      try {
          const features = new APIFeatures(
        this.model.find({ "from": userId,"isDeletedInSource":false }),
            query
          )
            .filter()
            .limitFields()
            .paginate()
            .sort();
        let sentMessages = await features.query;
        
          // await this.model.find({ "from": userId }).sort("-createdAt");
            // console.log(notifications);
            if (!sentMessages) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true, doc: sentMessages };
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
  }


   async getMessages(userId,query) {
     try {
       const features = new APIFeatures(
         this.model.find({ $or: [{ "from": userId, "isDeletedInSource": false, type: { $nin:["postReply","userMention"] } },{ "to": userId, "isDeletedInDestination": false, type: { $nin:["postReply","userMention"] } }] }),
            query
          )
            .filter()
            .limitFields()
            .paginate()
            .sort();
        let sentMessages = await features.query;
        
          // await this.model.find({ "from": userId }).sort("-createdAt");
            // console.log(notifications);
            if (!sentMessages) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true, doc: sentMessages };
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
  }

 async getAllMessages(userId,query) {
     try {
       const features = new APIFeatures(
         this.model.find({ $or: [{ "from": userId, "isDeletedInSource": false},{ "to": userId, "isDeletedInDestination": false }] }),
            query
          )
            .filter()
            .limitFields()
            .paginate()
            .sort();
        let sentMessages = await features.query;
        
          // await this.model.find({ "from": userId }).sort("-createdAt");
            // console.log(notifications);
            if (!sentMessages) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true, doc: sentMessages };
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
  }



    async getUnreadMessage(userId,query) {
      try {
          const features = new APIFeatures(
        this.model.find({ "to": userId,"isRead":false }),
            query
          )
            .filter()
            .limitFields()
            .paginate()
            .sort();
        let unreadMessages = await features.query;
        
        console.log(unreadMessages);
            if (!unreadMessages) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true, doc: unreadMessages };
      } catch (err) {
        console.log(err);
            return { success: false, ...decorateError(err) };
        }
  }
  
   async getPostReplies(userId,query) {
      try {
          const features = new APIFeatures(
        this.model.find({ "to": userId,"isDeletedInDestination":false,type:"postReply"}),
            query
          )
            .filter()
            .limitFields()
            .paginate()
            .sort();
        let postReplies = await features.query;
        
        console.log(postReplies);
            if (!postReplies) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true, doc: postReplies };
      } catch (err) {
        console.log(err);
            return { success: false, ...decorateError(err) };
        }
    }




async markAllAsRead(userId) {
        try {
            let messages = await this.model.updateMany({ "to": userId }, { isRead: true });
            //  console.log(notifications);
            if (!messages) {
                return { success: false, error: mongoErrors.UNKOWN };
            }
            return { success: true };
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
    }

 async deleteMessage(userId,messageId) {
        try {
          let message = await this.model.findById( messageId );
         
             console.log(message);
          if (!message ) {
            console.log("dddddddddddddddddddddd");
                // console.log("hhh");
                return { success: false, error: mongoErrors.NOT_FOUND};
          }
          let modified;
          if (message.to.equals(userId)) {
             modified=await this.model.findByIdAndUpdate(
                message._id,
                { isDeletedInDestination: true },
                {
                  new: true,
                  runValidators: true,
                });
          } else if (message.from.equals(userId)) {
             modified=await this.model.findByIdAndUpdate(
              message._id,
              { isDeletedInSource: true },
              {
                new: true,
                runValidators: true,
              });
          }
          if(modified)
            return { success: true };
          else return { success: false, error: mongoErrors.NOT_FOUND};
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
    }
}
module.exports = MessageRepository;
