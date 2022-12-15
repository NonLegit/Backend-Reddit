const { userErrors, mongoErrors, messageErrors } = require("../error_handling/errors");


class MessageService {
  constructor({ MessageRepository,UserRepository }) {
    this.messageRepo = MessageRepository;
    this.userRepo = UserRepository;
  }

    async createMessage(userId,message) {
        //validate post ID
        console.log("here");
        let userExisted = await this.userRepo.findByUserName(
            message.to,
            "",
            ""
        );//user id to send
        
            if (!userExisted.success)
            return { success: false, error: userErrors.USER_NOT_FOUND };
        const messageToSend = await this.messageRepo.createMessage(userId,message,userExisted.doc._id);
        if (!messageToSend.success) {
            console.log(messageToSend.error);
            return { success: false, error: messageToSend.error };

        }
        
        return { success: true, data: messageToSend.doc };
    }
    async createReplyMessage(user,comment,post) {
        //validate post ID
        
        const message = await this.messageRepo.createReplyMessage(user,comment,post);
        if (!message)
        return { success: false, error: message.error };

        
        
        return { success: true, data: message.doc };
    }   

    async getSentMessage(userId,query) {
    const sentMessages = await this.messageRepo.getSentMessage(userId,query);
     //console.log(notifications);
    if (!sentMessages.success) {
      return { success: false, error: sentMessages.error };
    }
    return { success: true, data: sentMessages.doc };
    }
    
     async getUnreadMessage(userId,query) {
    const unreadMessages = await this.messageRepo.getUnreadMessage(userId,query);
     //console.log(notifications);
    if (!unreadMessages.success) {
      return { success: false, error: unreadMessages.error };
    }
    return { success: true, data: unreadMessages.doc };
    }
    
    async getPostReplies(userId,query) {
    const postReplies = await this.messageRepo.getPostReplies(userId,query);
     //console.log(notifications);
    if (!postReplies.success) {
      return { success: false, error: postReplies.error };
    }
    return { success: true, data: postReplies.doc };
    }
    
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
