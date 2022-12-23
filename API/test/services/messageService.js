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