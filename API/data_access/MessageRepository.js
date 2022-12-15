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
        this.model.find({ "from": userId }),
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



}
module.exports = MessageRepository;
