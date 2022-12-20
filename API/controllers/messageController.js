const FCM = require("fcm-node");
//const serverKey = require("../nonlegit-df8a9-firebase-adminsdk-t3oo5-df87e5812d.json");
//const serverKey = "AAAAExvkdPQ:APA91bGYbrdVHWtvumTEOz3YncleOdyHiBjrdGq_BlotyC6WUlydVmhN0FDX4Uepu_YX0edQHgZmvnZuKDdMrRx5wofMLUyBIIcnWUSZinLdzenM-5tku84BfjtpSBuwIXFCbK8mg8HN";
const serverKey = process.env.FIREBASE_SERVER_KEY;
const fcm = new FCM(serverKey);
const { messageErrors, userErrors } = require("../error_handling/errors");

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
class MessageController {
  constructor({UserService,MessageService,NotificationService }) {
   
    this.userServices = UserService;
      this.messageServices = MessageService;
      this.notificationServices = NotificationService;
  }

//   addFirebaseToken = async (req, res) => {
//     if (!req.body || !req.body.token||!req.user){
//             res.status(400).json({
//                 status: "fail",
//                 message: "Invalid request",
//             });
//             return;
//       }
//       const token = req.body.token;
//       const userId = req.user._id;
//       const savedToUser = await this.userServices.saveFirebaseToken(userId,token);
//       if (!savedToUser.success) {
//           res.status(500).json({
//             message : "Internal server error",
//             statusCode : 500,
//             status : "Internal Server Error"
//         });
//          return;
//       }
//       return res.status(201).json();
      
//     }
 
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
      //  console.log(notification);
      if (invite.success) {
      
        let tokens = await this.notificationServices.getFirebaseToken(req.messageObject.to);
        // console.log(tokens.data.firebaseToken[0]);
        // console.log(notification.data);
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
         
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
          if (!req.user || !req.body.text || !req.body.subject || !req.body.to) {
                 res.status(400).json({
                status: "fail",
                message: "Invalid request",
            });
            return;
        }
        console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;");
        console.log(req.body.subject.length);
        if (req.body.subject.length >20) {
            res.status(400).json({
                status: "fail",
                message: "Subject must have less or equal than 100 characters",
            });
            return;
        }
          
          let messageToSend = await this.messageServices.createMessage(req.user._id, req.body);
           // console.log(messageToSend);
          if (messageToSend.success) {
             // console.log(messageToSend.data.to);
              let tokens = await this.notificationServices.getFirebaseToken(messageToSend.data.to);
            let message;
            console.log("mmmmmmmmmmmmmmmmmmmmmmmm");
            console.log(messageToSend.data);
            console.log("mmmmmmmmmmmmmmmmmmmmmmmm");
              if (tokens.success) {
                  message = {
                      to: tokens.data.firebaseToken,
                      data: { val: JSON.stringify(messageToSend.data) }
                  }
            };
           // console.log(tokens);
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
  
   reply = async (req, res) => {
      try {
         
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
          if (!req.user || !req.body.text || !req.params.parentMessageId) {
                 res.status(400).json({
                status: "fail",
                message: "Invalid request",
            });
            return;
          }
          
          let messageToSend = await this.messageServices.reply(req.user._id, req.body.text,req.params.parentMessageId);
           // console.log(messageToSend);
          if (messageToSend.success) {
             // console.log(messageToSend.data.to);
              let tokens = await this.notificationServices.getFirebaseToken(messageToSend.data.to);
            let message;
            console.log(tokens);
              if (tokens.success) {
                  message = {
                      to: tokens.data.firebaseToken,
                      data: { val: JSON.stringify(messageToSend.data) }
                  }
            };
           // console.log(tokens);
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

  createReplyMessage = async (req, res) => {
    try {
      console.log("herssssssssssssssssssssssssssssssssssssse");
      if (!req.user || !req.comment || !req.post || !req.mentions) {
        return;
      }
      console.log("iiiiiiiiiiiiii");
      let messageToSend = await this.messageServices.createReplyMessage(req.user, req.comment, req.post, req.mentions);
      console.log(req.post);
    
     
      return;
    } catch (err) {
      return;
    }
    }

  getMessages = async (req, res) => {
  {
    try {
      let userId = req.user._id;
      let sentMessages = await this.messageServices.getMessages(userId,req.query);
      //console.log(notifications);
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
   getAllMessages = async (req, res) => {
  {
    try {
      let userId = req.user._id;
      let allMessages = await this.messageServices.getAllMessages(userId,req.query);
      //console.log(notifications);
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
    
    getSentMessage = async (req, res) => {
          try {
      let userId = req.user._id;
      let sentMessages = await this.messageServices.getSentMessage(userId,req.query);
      //console.log(notifications);
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
 getUnreadMessage = async (req, res) => {
          try {
      let userId = req.user._id;
      let unreadMessages = await this.messageServices.getUnreadMessage(userId,req.query);
      //console.log(notifications);
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
  
markAllAsRead=async (req, res) => {
    try {
      let userId = req.user._id;
      let messages = await this.messageServices.markAllAsRead(userId);
      //console.log(notifications);
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
    deleteMessage=async (req, res) => {
    try {
        let userId = req.user._id;
        //if(!req.params.messageId!!!req.params.messageId.)
      //console.log(req.params.notificationId);
      let messageToDelete = await this.messageServices.deleteMessage(userId,req.params.messageId);
      //console.log(notifications);
      if (!messageToDelete.success) {
          //console.log(messageToDelete);
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
    
     getPostReplies = async (req, res) => {
          try {
      let userId = req.user._id;
      let postReplies = await this.messageServices.getPostReplies(userId,req.query);
      //console.log(notifications);
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