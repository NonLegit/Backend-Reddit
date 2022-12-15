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
       
            let data;
            if (!post.subreddit) {
               data = {
                    type: 'postReply',
                    from:  user._id,
            
                    subreddit:  post.subreddit._id,
                    
                    comment: comment._id,
                       
                    to:  post.author._id,
                        
                    
                    post: post._id
                };
            } else {
                data = {
                    type: 'postReply',
                    from:  user._id,
            
                    
                    comment: comment._id,
                       
                    to:  post.author._id,
                        
                    
                    post: post._id
                };
            }
        
            let message = await this.model.create(data);
            if (!message)
                return { success: false, error: mongoErrors.UNKOWN };
            
        
        
            //notify ba2a
            return { success: true, doc: message };
            
        } catch (err) {
            return { success: false, ...decorateError(err) };
        }
            
       
    }





}
module.exports = MessageRepository;
