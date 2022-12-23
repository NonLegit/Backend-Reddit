const FCM = require("fcm-node");
const serverKey = process.env.FIREBASE_SERVER_KEY;
const fcm = new FCM(serverKey);
const { messageErrors, userErrors } = require("../error_handling/errors");


class MessageController {
  constructor({UserService,MessageService,NotificationService }) {
   
    this.userServices = UserService;
      this.messageServices = MessageService;
      this.notificationServices = NotificationService;
  }
//done not right

  modMessage = async (req, res) => {
    try {
      if (!req.messageObject) {
        res.status(400).json({
          status: "fail",
          message: "Invalid request",
        });
        return;
      }
      let invite = await this.messageServices.modMessage(req.messageObject);
      
      if (invite.success) {
      
        let tokens = await this.notificationServices.getFirebaseToken(req.messageObject.to);
        let message;
        if (tokens.success) {
          
          message = {
            to: tokens.data.firebaseToken,
            data: { val: JSON.stringify(invite.data) }
          }
        
          fcm.send(message, (err, response) => {

            if (err) {
              console.log("Something has gone wrong!" + err);
            } else {
              console.log("Successfully sent with response: ");
            }
          });
        }
      }
      return;
    } catch (err) {
      return;
    }
 }
  
 
  
  sendMessage = async (req, res) => {
      try {
         
        
        if (!req.user || !req.body.text || !req.body.subject || !req.body.to) {
         
                 res.status(400).json({
                status: "fail",
                message: "Invalid request",
            });
            return;
        }
       
        if (req.body.subject.length > 20) {
          
            res.status(400).json({
                status: "fail",
                message: "Subject must have less or equal than 100 characters",
            });
            return;
        }
          
          let messageToSend = await this.messageServices.createMessage(req.user._id, req.body);
          
          if (messageToSend.success) {
       
              let tokens = await this.notificationServices.getFirebaseToken(messageToSend.data.to);
            let message;
           
              if (tokens.success) {
                  message = {
                      to: tokens.data.firebaseToken,
                      data: { val: JSON.stringify(messageToSend.data) }
                  }
            };
          
              fcm.send(message, (err, response) => {
                  if (err) {
                      console.log("Something has gone wrong!" + err);
                  } else {
                      console.log("Successfully sent with response: ");
                  }
              });

          }
        if (!messageToSend.success) {
          if (messageToSend.error == userErrors.USER_NOT_FOUND) {
            return res.status(404).json({
            status: "Not Found",
            message: "User Not Found",
        });
        }
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:messageToSend.data
      });
      } catch (err) {
            console.log("error in subredditservices " + err);
    return  res.status(500).json({
        status: "fail",
      });
      }
     
  }
  
  //done
  
  reply = async (req, res) => {
      try {
         
       
        if (!req.user || !req.body.text || !req.params.parentMessageId) {
          
                 res.status(400).json({
                status: "fail",
                message: "Invalid request",
            });
            return;
          }
          
          let messageToSend = await this.messageServices.reply(req.user._id, req.body.text,req.params.parentMessageId);
           
          if (messageToSend.success) {
             
              let tokens = await this.notificationServices.getFirebaseToken(messageToSend.data.to);
            let message;
            console.log(tokens);
              if (tokens.success) {
                  message = {
                      to: tokens.data.firebaseToken,
                      data: { val: JSON.stringify(messageToSend.data) }
                  }
            };
           
              fcm.send(message, (err, response) => {
                  if (err) {
                      console.log("Something has gone wrong!" + err);
                  } else {
                      console.log("Successfully sent with response: ");
                  }
              });

          }
        if (!messageToSend.success) {
          if (messageToSend.error == messageErrors.MESSAGE_NOT_FOUND) {
            return res.status(404).json({
            status: "Not Found",
            message: "Message Not Found",
        });
          } else if (messageToSend.error == messageErrors.MESSAGE_NOT_FOUND_IN_INBOX) {
              return res.status(404).json({
            status: "Not Found",
            message: "Message Not Found In Your Inbox",
        });
        }
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:messageToSend.data
      });
      } catch (err) {
            console.log("error in subredditservices " + err);
    return  res.status(500).json({
        status: "fail",
      });
      }
     
    }

  //done
  createReplyMessage = async (req, res) => {
    try {
      
      if (!req.user || !req.comment || !req.post || !req.mentions) {
        return;
      }
     
      let messageToSend = await this.messageServices.createReplyMessage(req.user, req.comment, req.post, req.mentions);
   
    
     
      return;
    } catch (err) {
      return;
    }
    }

  //done
  getMessages = async (req, res) => {
  {
    try {
      let userId = req.user._id;
      let sentMessages = await this.messageServices.getMessages(userId,req.query);
      
      if (!sentMessages.success) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:sentMessages.data
      });
    } catch (err) {
        console.log("error in message controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
      
  }
  }
  //done
   getAllMessages = async (req, res) => {
  {
    try {
      let userId = req.user._id;
      let allMessages = await this.messageServices.getAllMessages(userId,req.query);
     
      if (!allMessages.success) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:allMessages.data
      });
    } catch (err) {
        console.log("error in message controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
      
  }
}
  //done
   getSentMessage = async (req, res) => {
          try {
      let userId = req.user._id;
      let sentMessages = await this.messageServices.getSentMessage(userId,req.query);
     
      if (!sentMessages.success) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:sentMessages.data
      });
    } catch (err) {
        console.log("error in message controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
      
  }
  //done
  getUnreadMessage = async (req, res) => {
          try {
      let userId = req.user._id;
      let unreadMessages = await this.messageServices.getUnreadMessage(userId,req.query);
     
      if (!unreadMessages.success) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:unreadMessages.data
      });
    } catch (err) {
        console.log("error in message controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
      
  }
  //done
  markAllAsRead=async (req, res) => {
    try {
      let userId = req.user._id;
      let messages = await this.messageServices.markAllAsRead(userId);
   
      if (!messages.success) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(201).json({});
    } catch (err) {
        console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  //done
    deleteMessage=async (req, res) => {
    try {
        let userId = req.user._id;
   
      let messageToDelete = await this.messageServices.deleteMessage(userId,req.params.messageId);
      
      if (!messageToDelete.success) {
          
        let message, statusCode, status;
        switch (messageToDelete.error) {
          case messageErrors.MESSAGE_NOT_FOUND:
            message = "Message not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case messageErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
         return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }
      return res.status(201).send();
    } catch (err) {
        console.log("error in message controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
    }
    //done
     getPostReplies = async (req, res) => {
          try {
      let userId = req.user._id;
      let postReplies = await this.messageServices.getPostReplies(userId,req.query);
  
      if (!postReplies.success) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:postReplies.data
      });
    } catch (err) {
        console.log("error in message controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
      
  }
 
  }
module.exports = MessageController;