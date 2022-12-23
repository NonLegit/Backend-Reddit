const { postErrors, mongoErrors, notificationErrors } = require("../error_handling/errors");

/**
 * this class is used for implementing Notification Service functions
 * @param {Repository} notificationRepo - notification repository object to access repository functions using notification model
 * @param {Repository} userRepo - user repository object to access repository functions using user model
 */
class NotificationService {
  constructor({ NotificationRepository,UserRepository }) {
    this.notificationRepo = NotificationRepository;
    this.userRepo = UserRepository;
  }


   /**
   * add reply notification service function
   * @param {object} user - user who created the reply
   * @param {object} comment - comment created on the post
   * @param {object} post - post which has reply on it 
   * @returns {Object} - a response containing the created notification.
   *
   */
  async addReplyNotification(user,comment,post) {
    
    const notification = await this.notificationRepo.addReplyNotification(user,comment,post);
    if (!notification.success)
      return { success: false, error: notification.error };

    
    
    return { success: true, data: notification.doc };
  }

   /**
   * add mentions notifications service function
   * @param {object} user - user who created the reply
   * @param {object} comment - comment created on the post
   * @param {object} post - post which has reply on it 
   * @param {Array} mentions - list of mentions on in the reply
   * @returns {Object} - a response containing the created notifications.
   *
   */
   async sendMentions(user,comment,post,mentions) {
    
    const notification = await this.notificationRepo.sendMentions(user,comment,post,mentions);
    if (!notification.success)
      return { success: false, error: notification.error };

    
    
    return { success: true, data: notification.doc };
  }

  /**
   * add follow notifications service function
   * @param {object} follower - user who request the follow
   * @param {object} followed - user who is requested to be followed
   * @returns {Object} - a response containing the created notification.
   */
   async addFollowNotification(follower,followed) {
   
     const notification = await this.notificationRepo.addFollowNotification(follower, followed);
 
    if (!notification.success)
      return { success: false, error: notification.error };

    
    
    return { success: true, data: notification.doc };
  }

    /**
   * add firebase token service function
   * @param {String} userId - user to get his token
   * @returns {Object} - a response containing the user firebase token.
   */
  async getFirebaseToken(userId) {
   
    const tokens = await this.userRepo.getFirebaseToken(userId);
    if (!tokens.success)
      return { success: false, error: tokens.error };

    
    
    return { success: true, data: tokens.doc };
  }

 /**
   * get all notifications service function
   * @param {String} userId - user to get his notifications
   * @returns {Object} - a response containing the notifications.
   */

  async getAllNotifications(userId) {
    const notifications = await this.notificationRepo.getAllNotifications(userId);

    if (!notifications.success) {
      return { success: false, error: notifications.error };
    }
    return { success: true, data: notifications.doc };
  }
  

   /**
   * mark all notifications sd read service function
   * @param {String} userId - user to mark his notifications as read
   * @returns {Object} - a response containing success status.
   */
  async markAllNotificationsAsRead(userId) {
 const notifications = await this.notificationRepo.markAllNotificationsAsRead(userId);

   
    if (!notifications.success) {
      return { success: false, error: notifications.error };
    }
    return { success: true }; 
  }
  
   /**
   * mark notification as read service function
   * @param {String} userId - user to mark his notifications as read.
   * @param {String} notificationId - notification id to mark  as read.
   * @returns {Object} - a response containing success status.
   */
   async markNotificationAsRead(userId,notificationId) {
 const notification = await this.notificationRepo.markNotificationAsRead(userId,notificationId);


    if (!notification.success) {
      return { success: false, error: notificationErrors.NOTIFICATION_NOT_FOUND };
    }
    return { success: true }; 
  }
  
    /**
   * hide notifications service function
   * @param {String} userId - user to hide his notifications.
   * @param {String} notificationId - notification to hide.
   * @returns {Object} - a response containing success status.
   */
     async hideNotification(userId,notificationId) {
 const notification = await this.notificationRepo.hideNotification(userId,notificationId);

   
    if (!notification.success) {
      return { success: false, error: notificationErrors.NOTIFICATION_NOT_FOUND };
    }
    return { success: true }; 
}
  
  

}

module.exports = NotificationService;
