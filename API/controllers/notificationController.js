const FCM = require("fcm-node");
//const serverKey = require("../nonlegit-df8a9-firebase-adminsdk-t3oo5-df87e5812d.json");
//const serverKey = "AAAAExvkdPQ:APA91bGYbrdVHWtvumTEOz3YncleOdyHiBjrdGq_BlotyC6WUlydVmhN0FDX4Uepu_YX0edQHgZmvnZuKDdMrRx5wofMLUyBIIcnWUSZinLdzenM-5tku84BfjtpSBuwIXFCbK8mg8HN";
const serverKey = process.env.FIREBASE_SERVER_KEY;
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
          //to:"eBPImScAT829czRG9LMcyf:APA91bHQTHRIm7RslmHVrxPCvzKZ9yH7zcXtDXi7Guuyplzj6xS_HJmJeJRv5gXt6I1KKjrKMODAArZZVO2NYg1kSbK4m6wjuF942ul8u7cdqZ3GbPyxVj9D2LO4X5hEm0rZsK4ShxvP",
          // to: "e9fZCcAVgdjfaQyMkAq5VO:APA91bEYMvvwaBLo8Ec2OhFgnngTO1gXFgveBwyqSaniasvuMg9gXdG00cpJylY4vdk-RN0W6H2rpyBvE3POgZ3oPDNuDB9yn8FLsNo28R2JjcxwPowY9SyjNvxDolZVGEbu2VVmHFVY",
          //  registration_ids: ["eBPImScAT829czRG9LMcyf:APA91bHQTHRIm7RslmHVrxPCvzKZ9yH7zcXtDXi7Guuyplzj6xS_HJmJeJRv5gXt6I1KKjrKMODAArZZVO2NYg1kSbK4m6wjuF942ul8u7cdqZ3GbPyxVj9D2LO4X5hEm0rZsK4ShxvP",
          //  "cfMDd2dNTfIMxRBSfjtskS:APA91bGobI2lbIUVrbnfjVORHm_3r4ewihiaQteGzgTHx855_5xxHFRgrkn7vM90cAeFqVrROQkahqpkurzyaVXM6yCe_7mjh7Mrb4RlRqza6Y05W61DKfE9y_DpdxnShYlFEkisNLKD"],
          //to:"cfMDd2dNTfIMxRBSfjtskS:APA91bGobI2lbIUVrbnfjVORHm_3r4ewihiaQteGzgTHx855_5xxHFRgrkn7vM90cAeFqVrROQkahqpkurzyaVXM6yCe_7mjh7Mrb4RlRqza6Y05W61DKfE9y_DpdxnShYlFEkisNLKD",
          registration_ids:tokens.data.firebaseToken,
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


  markNotificationAsRead=async (req, res) => {
    try {
      let userId = req.user._id;
      console.log(req.params.notificationId);
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



   hideNotification=async (req, res) => {
    try {
      let userId = req.user._id;
      console.log(req.params.notificationId);
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