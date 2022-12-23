const FCM = require("fcm-node");
const serverKey = process.env.FIREBASE_SERVER_KEY;
const fcm = new FCM(serverKey);
const { notificationErrors, userErrors } = require("../error_handling/errors");


class NotificationController {
  constructor({UserService,NotificationService }) {
   
    this.userServices = UserService;
    this.notificationServices = NotificationService;
  }


//done
  addFirebaseToken = async (req, res) => {
    try {
      if (!req.body || !req.body.token || !req.user) {
        res.status(400).json({
          status: "fail",
          message: "Invalid request",
        });
        return;
      }
      const token = req.body.token;
      const userId = req.user._id;
      const savedToUser = await this.userServices.saveFirebaseToken(userId, token);
      if (!savedToUser.success) {
        res.status(500).json({
          message: "Internal server error",
          statusCode: 500,
          status: "Internal Server Error"
        });
        return;
      }
      return res.status(201).json();
    } catch (err) {
       res.status(500).json({
        status: "fail",
      });
    }
    }
 
 
  addReplyNotification = async (req, res, next) => {
    try {
      if (!req.user || !req.comment || !req.post) {
        return;
      }
      let notification = await this.notificationServices.addReplyNotification(req.user, req.comment, req.post);
      if (req.mentions) {
        let notifyMentions = await this.sendMentions(req.user, req.comment, req.post, req.mentions);
      }
      if (notification.success) {
      
        let tokens = await this.notificationServices.getFirebaseToken(req.post.author._id);
        let message;
        if (tokens.success) {
          message = {
            to: tokens.data.firebaseToken,
            data: { val: JSON.stringify(notification.data) }
          }
        
          fcm.send(message, (err, response) => {
            if (err) {
              console.log("Something has gone wrong!" + err);
            } else {
              console.log("Successfully sent with response: ");
            }
          });
          console.log("noooo body is in here");
          console.log(message);
          //  console.log(notification.data);
        }
        if (notification.data.type == "postReply" || notification.data.type == "userMention")
          return next();
      
      }
      return;
    } catch (err) {
      return;
      }
    
    }
    
  sendMentions = async (user, comment, post,mentions) => {
  
    try {
      let notification = await this.notificationServices.sendMentions(user, comment, post, mentions);
      
      if (notification.success) {
        // if(notification.data.length==0)
        let tokens;
        if (notification.data.length == 0) {
          return;
        }
        for (let i = 0; i < notification.data.length; i++) {
          console.log("comme si t' etais la");
          if (mentions[i].userId == user._id) continue;
          let oneToken = await this.notificationServices.getFirebaseToken(mentions[i].userId);

          let message;
          if (oneToken.success) {
        
            message = {
              to: oneToken.data.firebaseToken,
              data: { val: JSON.stringify(notification.data[i]) }
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
      

      }
      return;
    } catch (err) {
      return;
    }
    }
  
  
  //done
   addFollowNotification = async (req, res) => {
     try {
       if (!req.follower || !req.followed) {
         return;
       }
       console.log("iiiiiiiiiiiiii");
       let notification = await this.notificationServices.addFollowNotification(req.follower, req.followed);
       //  console.log(notification);
       if (notification.success) {
      
         let tokens = await this.notificationServices.getFirebaseToken(req.followed._id);
         // console.log(tokens.data.firebaseToken[0]);
         // console.log(notification.data);
         let message;
         if (tokens.success) {
           message = {
             to: tokens.data.firebaseToken,
             data: { val: JSON.stringify(notification.data) }
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
       return;
     } catch (err) {
       return;
     }
    }
    
  
    

//done
  
  getAllNotifications = async (req, res) => {
    try {
      let userId = req.user._id;
      let notifications = await this.notificationServices.getAllNotifications(userId);
      //console.log(notifications);
      if (!notifications.success) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        status: "OK",
        data:notifications.data
      });
    } catch (err) {
        console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }


  //done
markAllNotificationsAsRead=async (req, res) => {
    try {
      let userId = req.user._id;
      let notifications = await this.notificationServices.markAllNotificationsAsRead(userId);
      //console.log(notifications);
      if (!notifications.success) {
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
  markNotificationAsRead=async (req, res) => {
    try {
      let userId = req.user._id;
     // console.log(req.params.notificationId);
      let notification = await this.notificationServices.markNotificationAsRead(userId,req.params.notificationId);
      //console.log(notifications);
      if (!notification.success) {

        let message, statusCode, status;
        switch (notification.error) {
          case notificationErrors.NOTIFICATION_NOT_FOUND:
            message = "Notification not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case notificationErrors.MONGO_ERR:
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
        console.log("error in notification controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }


//done
   hideNotification=async (req, res) => {
    try {
      let userId = req.user._id;
   //   console.log(req.params.notificationId);
      let notification = await this.notificationServices.hideNotification(userId,req.params.notificationId);
      //console.log(notifications);
      if (!notification.success) {

        let message, statusCode, status;
        switch (notification.error) {
          case notificationErrors.NOTIFICATION_NOT_FOUND:
            message = "Notification not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case notificationErrors.MONGO_ERR:
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
        console.log("error in notification controller " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  }
module.exports = NotificationController;