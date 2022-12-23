const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const { messageErrors,mongoErrors } = require("./../../error_handling/errors");
dotenv.config({ path: "config/config.env" });

const MessageService = require("./../../service/messageService");



describe("create moderator message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        modMessage: async(msg) => {
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
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.modMessage();
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const MessageRepository = {
        modMessage: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.modMessage();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});


describe("create reply message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        createReplyMessage: async(msg) => {
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
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.createReplyMessage();
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first message");
      
    }); 
});


describe("get sent message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        getSentMessage: async(msg) => {
          const response = {
            success: true,
            doc: 
              [{
              text: "first message",
              __v: 0
            }  ]     
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getSentMessage();
      expect(result.success).to.equal(true);
      expect(result.data[0].text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const MessageRepository = {
        getSentMessage: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getSentMessage();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});


describe("get inbox message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        getMessages: async(msg) => {
          const response = {
            success: true,
            doc: 
              [{
              text: "first message",
              __v: 0
            }  ]     
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getMessages();
      expect(result.success).to.equal(true);
      expect(result.data[0].text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const MessageRepository = {
        getMessages: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getMessages();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});



describe("get all message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        getAllMessages: async(msg) => {
          const response = {
            success: true,
            doc: 
              [{
              text: "first message",
              __v: 0
            }  ]     
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getAllMessages();
      expect(result.success).to.equal(true);
      expect(result.data[0].text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const MessageRepository = {
        getAllMessages: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getAllMessages();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});


describe("get unread message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        getUnreadMessage: async(msg) => {
          const response = {
            success: true,
            doc: 
              [{
              text: "first message",
              __v: 0
            }  ]     
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getUnreadMessage();
      expect(result.success).to.equal(true);
      expect(result.data[0].text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const MessageRepository = {
        getUnreadMessage: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getUnreadMessage();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});


describe("get post replies message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        getPostReplies: async(msg) => {
          const response = {
            success: true,
            doc: 
              [{
              text: "first message",
              __v: 0
            }  ]     
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getPostReplies();
      expect(result.success).to.equal(true);
      expect(result.data[0].text).to.equal( "first message");
      
    });
     it("2) test fail", async () => {
      const MessageRepository = {
        getPostReplies: async(msg) => {
          const response = {
              success: false, 
            error:mongoErrors.UNKOWN  
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.getPostReplies();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( mongoErrors.UNKOWN );
      
    });
  
});


describe("mark all as read", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        markAllAsRead: async(msg) => {
          const response = {
            success: true    
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.markAllAsRead();
      expect(result.success).to.equal(true);
    
      
    });
    it("2) test fail", async () => {
      const MessageRepository = {
        markAllAsRead: async(msg) => {
          const response = {
            success: false    
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.markAllAsRead();
      expect(result.success).to.equal(false);
    
      
    });
  
});

describe("delete message", () => {
  
    it("1) test success", async () => {
      const MessageRepository = {
        deleteMessage: async(msg) => {
          const response = {
            success: true    
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.deleteMessage();
      expect(result.success).to.equal(true);
    
      
    });
     it("2) test fail", async () => {
      const MessageRepository = {
        deleteMessage: async(msg) => {
          const response = {
              success: false, 
            
          };         
          return response;
        },
      };
      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.deleteMessage();
      expect(result.success).to.equal(false);
      expect(result.error).to.equal(messageErrors.MESSAGE_NOT_FOUND);
      
    });
  
});


describe("create message", () => {
  
    it("1) test success", async () => {
         const message = { to: "" };
      const MessageRepository = {
        createMessage: async(msg) => {
          const response = {
            success: true    
          };         
          return response;
        },
        };
         const UserRepository = {
        findByName: async(msg) => {
          const response = {
              success: true,
             doc:{_id:" "}    
          };         
          return response;
        },
        };

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,UserRepository});
      const result = await messageServiceObj.createMessage(on,message);
      expect(result.success).to.equal(true);
    
      
    });
    it("2) test fail", async () => {
        const message = { to: "" };
      const MessageRepository = {
        createMessage: async(msg) => {
          const response = {
              success: false, 
            
          };         
          return response;
        },
         };
           const UserRepository = {
        findByName: async(msg) => {
          const response = {
              success: true,
            doc:{_id:" "}  
          };         
          return response;
        },
        };

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,UserRepository});
      const result = await messageServiceObj.createMessage(on,message);
      expect(result.success).to.equal(false);
      
      
    });
    it("3) test fail user not existed", async () => {
        const message = { to: "" };
      const MessageRepository = {
        createMessage: async(msg) => {
          const response = {
              success: false, 
            
          };         
          return response;
        },
         };
           const UserRepository = {
        findByName: async(msg) => {
          const response = {
              success: false
          };         
          return response;
        },
        };

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,UserRepository});
      const result = await messageServiceObj.createMessage(on,message);
      expect(result.success).to.equal(false);
      
      
    });
  
});




describe("create reply", () => {
  
    it("1) test success", async () => {
        const userId =mongoose.Types.ObjectId("636e901bbc485bd111dd3880");
      const MessageRepository = {
        reply: async(msg) => {
          const response = {
            success: true    
          };         
          return response;
          },
          findById: async(msg) => {
          const response = {
              success: true,
              doc: {
                  to: { _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880")},
                  from:{_id:mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),}
              }    
          };         
          return response;
        },
        };
        

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.reply(userId);
      expect(result.success).to.equal(true);
    
      
    });
    it("2) test message does not exist", async () => {
        const userId =mongoose.Types.ObjectId("636e901bbc485bd111dd3880");
      const MessageRepository = {
        
          findById: async(msg) => {
          const response = {
              success: false,
               
          };         
          return response;
        },
        };
        

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.reply(userId);
      expect(result.success).to.equal(false);
    
      
    });
   it("3) test fail", async () => {
        const userId =mongoose.Types.ObjectId("636e901bbc485bd111dd3880");
      const MessageRepository = {
        reply: async(msg) => {
          const response = {
              success: false,
            error:  mongoErrors.UNKOWN
          };         
          return response;
          },
          findById: async(msg) => {
          const response = {
              success: true,
              doc: {
                  to: { _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880")},
                  from:{_id:mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),}
              }    
          };         
          return response;
        },
        };
        

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.reply(userId);
      expect(result.success).to.equal(false);
    
      
   });
    it("4) test success", async () => {
        const userId =mongoose.Types.ObjectId("636e901bbc485bd111dd3880");
      const MessageRepository = {
        reply: async(msg) => {
          const response = {
            success: true    
          };         
          return response;
          },
          findById: async(msg) => {
          const response = {
              success: true,
              doc: {
                 to: { _id: mongoose.Types.ObjectId("636e901bbc485bd101dd3880")},
                  from:{_id:mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),}
              }    
          };         
          return response;
        },
        };
        

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.reply(userId);
      expect(result.success).to.equal(true);
    
      
    });
    it("5) test success", async () => {
        const userId =mongoose.Types.ObjectId("636e901bbc485bd111dd3880");
      const MessageRepository = {
        reply: async(msg) => {
          const response = {
            success: true    
          };         
          return response;
          },
          findById: async(msg) => {
          const response = {
              success: true,
              doc: {
                  to: { _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880")},
                  from:{_id:mongoose.Types.ObjectId("636e901bbc485bd111dd3280"),}
              }    
          };         
          return response;
        },
        };
        

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.reply(userId);
      expect(result.success).to.equal(true);
    
      
    });
    it("1) test success", async () => {
        const userId =mongoose.Types.ObjectId("636e901bbc485bd111dd3880");
      const MessageRepository = {
        reply: async(msg) => {
          const response = {
            success: true    
          };         
          return response;
          },
          findById: async(msg) => {
          const response = {
              success: true,
              doc: {
                  to: { _id: mongoose.Types.ObjectId("636e901bbc485bd111d03880")},
                  from:{_id:mongoose.Types.ObjectId("636e901bbc485bd111d03880"),}
              }    
          };         
          return response;
        },
        };
        

      const on = {};
      const messageServiceObj = new MessageService({  MessageRepository,on});
      const result = await messageServiceObj.reply(userId);
      expect(result.success).to.equal(false);
    
      
    });
});

