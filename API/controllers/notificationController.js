const FCM = require("fcm-node");
const serverKey = require("../nonlegit-df8a9-firebase-adminsdk-t3oo5-df87e5812d.json");
const fcm = new FCM(serverKey);
const { notificationErrors, userErrors } = require("../error_handling/errors");

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
class NotificationController {
  constructor({UserService,NotificationService }) {
   
    this.userServices = UserService;
    this.notificationServices = NotificationService;
  }

  addFirebaseToken = async (req, res) => {
    if (!req.body || !req.body.token||!req.user){
            res.status(400).json({
                status: "fail",
                message: "Invalid request",
            });
            return;
      }
      const token = req.body.token;
      const userId = req.user._id;
      const savedToUser = await this.userServices.saveFirebaseToken(userId,token);
      if (!savedToUser.success) {
          res.status(500).json({     
            message : "Internal server error",
            statusCode : 500,
            status : "Internal Server Error"
        });
         return;
      }
      return res.status(201).json();
      
    }
 
 
  addReplyNotification = async (req, res) => {
    
    if (!req.user || !req.comment || !req.post) {
      return;
    }
    console.log("iiiiiiiiiiiiii");
    let notification = await this.notificationServices.addReplyNotification(req.user, req.comment, req.post);
    
    if (notification.success) {
      
      let tokens = await this.notificationServices.getFirebaseToken(req.user._id);
      console.log(tokens.data.firebaseToken[0]);
      console.log(notification.data);
      let message;
      if (tokens.success) {
         message = {
          to:"eBPImScAT829czRG9LMcyf:APA91bHQTHRIm7RslmHVrxPCvzKZ9yH7zcXtDXi7Guuyplzj6xS_HJmJeJRv5gXt6I1KKjrKMODAArZZVO2NYg1kSbK4m6wjuF942ul8u7cdqZ3GbPyxVj9D2LO4X5hEm0rZsK4ShxvP",
          
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
      return ;
    }
    
  
    


  getAllNotifications = async (req, res) => {
    try {
      let userId = req.user._id;
      let notifications = await this.notificationServices.getAllNotifications(userId);
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

  }
module.exports = NotificationController;