const { userErrors, mongoErrors, messageErrors } = require("../error_handling/errors");

/**
 * this class is used for implementing message Service functions
 * @param {Repository} messageRepo - message repository object to access repository functions using notification model
 * @param {Repository} userRepo - user repository object to access repository functions using user model
 */

class MessageService {
  constructor({ MessageRepository,UserRepository }) {
    this.messageRepo = MessageRepository;
    this.userRepo = UserRepository;
  }

 /**
   *This function add moderation message to db
   * @param {String} msg - message to be added to db
   * @returns {Object} - a response containg the message created
   */
  async modMessage(msg) {
  
           
        const messageToSend = await this.messageRepo.modMessage(msg);
        if (!messageToSend.success) {
          //  console.log(messageToSend.error);
            return { success: false, error: messageToSend.error };

        }
        
        return { success: true, data: messageToSend.doc };
  }
 /**
   * create message service function
   * @param {String} userId - user id who created the message
   * @param {object} message - message to create
   * @returns {Object} - a response containing the created message.
   *
   */
    async createMessage(userId,message) {
       
        let userExisted = await this.userRepo.findByName(
            message.to
           
        );
      
            if (!userExisted.success)
            return { success: false, error: userErrors.USER_NOT_FOUND };
        const messageToSend = await this.messageRepo.createMessage(userId,message,userExisted.doc._id);
        if (!messageToSend.success) {
          
            return { success: false, error: messageToSend.error };

        }
        
        return { success: true, data: messageToSend.doc };
  }


   /**
   * create reply service function
   * @param {String} userId - user id who created the message
   * @param {String} text - text of the reply to be created
   * @param {String} parentMessageId - id of the parent message which this reply is created on 
   * @returns {Object} - a response containing the created reply.
   *
   */
   async reply(userId,text,parentMessageId) {
   
     let messageExisted = await this.messageRepo.findById(parentMessageId);

     
     if (!messageExisted.success) {
        return { success: false, error: messageErrors.MESSAGE_NOT_FOUND };
     }
     if (!messageExisted.doc.to._id.equals(userId)&&!messageExisted.doc.from._id.equals(userId)) {
           return { success: false, error: messageErrors.MESSAGE_NOT_FOUND_IN_INBOX };
        }
        const messageToSend = await this.messageRepo.reply(userId,text,messageExisted.doc);
        if (!messageToSend.success) {
          
            return { success: false, error: messageToSend.error };

        }
        
        return { success: true, data: messageToSend.doc };
  }
  

   /**
   * create post reply service function
   * @param {String} user - user to create the reply
   * @param {Object} comment - the comment object on the post
   * @param {String} post - post object which has the comment on it 
   * @returns {Object} - a response containing the created post reply message.
   *
   */
    async createReplyMessage(user,comment,post) {
        //validate post ID
        
        const message = await this.messageRepo.createReplyMessage(user,comment,post);
        if (!message)
        return { success: false, error: message.error };

        
        
        return { success: true, data: message.doc };
    }   

    /**
   * get sent messages service function
   * @param {String} userId - user to get sent messages
   * @param {Object} query - query 
   * @returns {Object} - a response containing array of sent messages.
   *
   */
    async getSentMessage(userId,query) {
    const sentMessages = await this.messageRepo.getSentMessage(userId,query);
     //console.log(notifications);
    if (!sentMessages.success) {
      return { success: false, error: sentMessages.error };
    }
    return { success: true, data: sentMessages.doc };
  }
    /**
   * get inbox messages service function
   * @param {String} userId - user to get sent messages
   * @param {Object} query - query 
   * @returns {Object} - a response containing array of inbox messages.
   *
   */
  async getMessages(userId,query) {
    const sentMessages = await this.messageRepo.getMessages(userId,query);
     //console.log(notifications);
    if (!sentMessages.success) {
      return { success: false, error: sentMessages.error };
    }
    return { success: true, data: sentMessages.doc };
  }
 /**
   * get all messages service function
   * @param {String} userId - user to get all messages
   * @param {Object} query - query 
   * @returns {Object} - a response containing array of all messages.
   *
   */
   async getAllMessages(userId,query) {
    const allMessages = await this.messageRepo.getAllMessages(userId,query);
     //console.log(notifications);
    if (!allMessages.success) {
      return { success: false, error: allMessages.error };
    }
    return { success: true, data: allMessages.doc };
    }
     /**
   * get unread messages service function
   * @param {String} userId - user to get all messages
   * @param {Object} query - query 
   * @returns {Object} - a response containing array of unread messages.
   *
   */
     async getUnreadMessage(userId,query) {
    const unreadMessages = await this.messageRepo.getUnreadMessage(userId,query);
     //console.log(notifications);
    if (!unreadMessages.success) {
      return { success: false, error: unreadMessages.error };
    }
    return { success: true, data: unreadMessages.doc };
    }
    
   /**
   * get post replies messages service function
   * @param {String} userId - user to get post replies messages
   * @param {Object} query - query 
   * @returns {Object} - a response containing array of post replies messages.
   *
   */
    async getPostReplies(userId,query) {
    const postReplies = await this.messageRepo.getPostReplies(userId,query);
     //console.log(notifications);
    if (!postReplies.success) {
      return { success: false, error: postReplies.error };
    }
    return { success: true, data: postReplies.doc };
    }
    
   /**
   * get post unread messages service function
   * @param {String} userId - user to get post unread messages
   * @param {Object} query - query 
   * @returns {Object} - a response containing array of post unread messages.
   *
   */
     async getUnreadMessage(userId,query) {
    const unreadMessages = await this.messageRepo.getUnreadMessage(userId,query);
     //console.log(notifications);
    if (!unreadMessages.success) {
      return { success: false, error: unreadMessages.error };
    }
    return { success: true, data: unreadMessages.doc };
    }

  async markAllAsRead(userId,messageId) {
 const messages = await this.messageRepo.markAllAsRead(userId,messageId);

     //console.log(notifications);
    if (!messages.success) {
      return { success: false, error: messageErrors.MONGO_ERR };
    }
    return { success: true }; 
  }
 /**
   * get post unread messages service function
   * @param {String} userId - user to get post unread messages
   * @param {String} messageId - message id to delete
   * @returns {Object} - a response containing success status.
   *
   */
    async deleteMessage(userId,messageId) {
 const message = await this.messageRepo.deleteMessage(userId,messageId);

     //console.log(notifications);
    if (!message.success) {
      return { success: false, error: messageErrors.MESSAGE_NOT_FOUND };
    }
    return { success: true }; 
  }
}

module.exports = MessageService;
