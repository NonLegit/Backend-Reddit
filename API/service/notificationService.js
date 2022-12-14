const { postErrors, mongoErrors, notificationErrors } = require("../error_handling/errors");


class NotificationService {
  constructor({ NotificationRepository,UserRepository }) {
    this.notificationRepo = NotificationRepository;
    this.userRepo = UserRepository;
  }

  async addReplyNotification(user,comment,post) {
    //validate post ID
    const notification = await this.notificationRepo.addReplyNotification(user,comment,post);
    if (!notification)
      return { success: false, error: notification.error };

    
    
    return { success: true, data: notification.doc };
  }

  async getFirebaseToken(userId) {
    //validate post ID
    const tokens = await this.userRepo.getFirebaseToken(userId);
    if (!tokens)
      return { success: false, error: notification.error };

    
    
    return { success: true, data: tokens.doc };
  }
  async getAllNotifications(userId) {
    const notifications = await this.notificationRepo.getAllNotifications(userId);

     //console.log(notifications);
    if (!notifications.success) {
      return { success: false, error: notifications.error };
    }
    return { success: true, data: notifications.doc };
  }
  
  async markAllNotificationsAsRead(userId) {
 const notifications = await this.notificationRepo.markAllNotificationsAsRead(userId);

     //console.log(notifications);
    if (!notifications.success) {
      return { success: false, error: notifications.error };
    }
    return { success: true }; 
}
   async markNotificationAsRead(userId,notificationId) {
 const notification = await this.notificationRepo.markNotificationAsRead(userId,notificationId);

     //console.log(notifications);
    if (!notification.success) {
      return { success: false, error: notificationErrors.NOTIFICATION_NOT_FOUND };
    }
    return { success: true }; 
  }
  
     async hideNotification(userId,notificationId) {
 const notification = await this.notificationRepo.hideNotification(userId,notificationId);

     //console.log(notifications);
    if (!notification.success) {
      return { success: false, error: notificationErrors.NOTIFICATION_NOT_FOUND };
    }
    return { success: true }; 
}
  

}

module.exports = NotificationService;
