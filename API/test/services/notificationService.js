const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const { notificationErrors,mongoErrors } = require("./../../error_handling/errors");
dotenv.config({ path: "config/config.env" });

const NotificationService = require("./../../service/notificationService");



describe("add reply notification", () => {
  
    it("1) test success", async () => {
      const NotificationRepository = {
        addReplyNotification: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.addReplyNotification();
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const NotificationRepository = {
        addReplyNotification: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.addReplyNotification();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});



describe("send mentions", () => {
  
    it("1) test success", async () => {
      const NotificationRepository = {
        sendMentions: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.sendMentions();
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const NotificationRepository = {
        sendMentions: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.sendMentions();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});


describe("add follow notification", () => {
  
    it("1) test success", async () => {
      const NotificationRepository = {
        addFollowNotification: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.addFollowNotification();
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const NotificationRepository = {
        addFollowNotification: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.addFollowNotification();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});

describe("get firebase token", () => {
  
    it("1) test success", async () => {
      const UserRepository = {
        getFirebaseToken: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  on,UserRepository});
      const result = await notificationServiceObj.getFirebaseToken();
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const UserRepository = {
        getFirebaseToken: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  on,UserRepository});
      const result = await notificationServiceObj.getFirebaseToken();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});


describe("get all notification", () => {
  
    it("1) test success", async () => {
      const NotificationRepository = {
        getAllNotifications: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.getAllNotifications();
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const NotificationRepository = {
        getAllNotifications: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.getAllNotifications();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});

describe("mark all as read", () => {
  
    it("1) test success", async () => {
      const NotificationRepository = {
        markAllNotificationsAsRead: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.markAllNotificationsAsRead();
      expect(result.success).to.equal(true);
     
      
    });
     it("2) test fail", async () => {
      const NotificationRepository = {
        markAllNotificationsAsRead: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.markAllNotificationsAsRead();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});

describe("mark one as read", () => {
  
    it("1) test success", async () => {
      const NotificationRepository = {
        markAllNotificationsAsRead: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.markAllNotificationsAsRead();
      expect(result.success).to.equal(true);
     
      
    });
     it("2) test fail", async () => {
      const NotificationRepository = {
        markNotificationAsRead: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.markNotificationAsRead();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( notificationErrors.NOTIFICATION_NOT_FOUND );
      
    });
  
});

describe("hide notification", () => {
  
    it("1) test success", async () => {
      const NotificationRepository = {
        hideNotification: async(msg) => {
          const response = {
            success: true,
            doc: 
              {
              text: "first message",
              __v: 0
            }       
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.hideNotification();
      expect(result.success).to.equal(true);
     
      
    });
     it("2) test fail", async () => {
      const NotificationRepository = {
        hideNotification: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const notificationServiceObj = new NotificationService({  NotificationRepository,on});
      const result = await notificationServiceObj.hideNotification();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( notificationErrors.NOTIFICATION_NOT_FOUND );
      
    });
  
});

