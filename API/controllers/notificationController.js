const { notificationErrors, userErrors } = require("../error_handling/errors");

class NotificationController {
  constructor({UserService }) {
   
    this.userServices = UserService;
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
       res.status(201).json();
      
    }
 
 

 
}

module.exports = PostController;
