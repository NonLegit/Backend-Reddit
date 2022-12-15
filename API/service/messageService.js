const { userErrors, mongoErrors, notificationErrors } = require("../error_handling/errors");


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
  

}

module.exports = MessageService;
