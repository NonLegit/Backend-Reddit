const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
dotenv.config();
const message = require("./../../controllers/messageController");
const { messageErrors,userErrors } = require("./../../error_handling/errors");


chai.use(sinonChai)

// const FCM = require("fcm-node");
// const serverKey = process.env.FIREBASE_SERVER_KEY;

//  adminInitStub               =   sinon.stub(FCM, 'send');
//    // admin.initializeApp();

// chai.use(sinonChai);

const statusJsonSpy = sinon.spy();
const next = sinon.spy();

// const proxyquire = require("proxyquire");


// const FCM = proxyquire("../controllers/messageController.js", {
//     "FCM":function(accountKey) {
//         send= function(){
//             console.log("lumiere");
//             return "hello";
//     }
// }});


const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};
describe("message test",()=> {
    describe("get messages test", () => {  
        it("1) test success", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getMessages: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getMessages(req, res);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status(500).json).to.have.been.calledWith({

                status: "OK",
                data: [{
                    _id: "638bed1001f496d7284c2832",
                }]
            })
        });
          it("2) test failure", async () => {
            const req = {
                
                    user: { _id: "125" }
                
            };
            const MessageService = {
                getMessages: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getMessages(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
        it("3) test fail exception", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getMessages: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getMessages(req, res);
            expect(res.status).to.have.been.calledWith(500);
              expect(res.status(500).json).to.have.been.calledWith({

               status: "fail"
            })
        });
    });

    describe("get all messages test", () => {  
        it("1) test success", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getAllMessages: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getAllMessages(req, res);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status(500).json).to.have.been.calledWith({

                status: "OK",
                data: [{
                    _id: "638bed1001f496d7284c2832",
                }]
            })
        });
          it("2) test failure", async () => {
            const req = {
                
                    user: { _id: "125" }
                
            };
            const MessageService = {
                getAllMessages: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getAllMessages(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
         it("3) test fail exception", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getAllMessages: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getAllMessages(req, res);
            expect(res.status).to.have.been.calledWith(500);
              expect(res.status(500).json).to.have.been.calledWith({

               status: "fail"
            })
        });
    }); 

    describe("get sent test", () => {  
        it("1) test success", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getSentMessage: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getSentMessage(req, res);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status(500).json).to.have.been.calledWith({

                status: "OK",
                data: [{
                    _id: "638bed1001f496d7284c2832",
                }]
            })
        });
          it("2) test failure", async () => {
            const req = {
                
                    user: { _id: "125" }
                
            };
            const MessageService = {
                getSentMessage: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getSentMessage(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
        it("3) test fail exception", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getSentMessage: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getSentMessage(req, res);
            expect(res.status).to.have.been.calledWith(200);
             expect(res.status(500).json).to.have.been.calledWith({

               status: "fail"
            })
        });
    }); 

    describe("get unread test", () => {  
        it("1) test success", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getUnreadMessage: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getUnreadMessage(req, res);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status(500).json).to.have.been.calledWith({

                status: "OK",
                data: [{
                    _id: "638bed1001f496d7284c2832",
                }]
            })
        });
          it("2) test failure", async () => {
            const req = {
                
                    user: { _id: "125" }
                
            };
            const MessageService = {
                getUnreadMessage: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getUnreadMessage(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
        it("3) test fail exception", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getUnreadMessage: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getUnreadMessage(req, res);
            expect(res.status).to.have.been.calledWith(500);
            
  expect(res.status(500).json).to.have.been.calledWith({

               status: "fail"
            })
           
        });
    });
    describe("get post replies test", () => {  
        it("1) test success", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getPostReplies: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getPostReplies(req, res);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status(500).json).to.have.been.calledWith({

                status: "OK",
                data: [{
                    _id: "638bed1001f496d7284c2832",
                }]
            })
        });
          it("2) test failure", async () => {
            const req = {
                
                    user: { _id: "125" }
                
            };
            const MessageService = {
                getPostReplies: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getPostReplies(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
         it("3) test fail exception", async () => {
            const req = {
              user: { _id: "125" }              
            };
            const MessageService = {
                getPostReplies: async (id) => {
                    const response = {
                        success: true,
                        data: [{
                            _id: "638bed1001f496d7284c2832"
                        }]
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.getPostReplies(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

               status: "fail"
            })
        });
    });
    describe("mark all as read test", () => {  
        it("1) test success", async () => {
            const req = {
                    user: { _id: "125" }
            };
            const MessageService = {
                markAllAsRead: async (id) => {
                    const response = {
                        success: true
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.markAllAsRead(req, res);
            expect(res.status).to.have.been.calledWith(201);
          expect(res.status(201).json).to.have.been.calledWith({});
        });
          it("2) test failure", async () => {
            const req = {
                
                    user: { _id: "125" }
                
            };
            const MessageService = {
                markAllAsRead: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.markAllAsRead(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
         it("3) test fail exception", async () => {
            const req = {
                    user: { _id: "125" }
            };
            const MessageService = {
                markAllAsRead: async (id) => {
                    const response = {
                        success: true
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.markAllAsRead(req, res);
            expect(res.status).to.have.been.calledWith(500);
             expect(res.status(500).json).to.have.been.calledWith({
              status: "fail"
          });
        });
    });
    describe("delete one message", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              params: {
                  messageId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const MessageService = {
                deleteMessage: async (id) => {
                    const response = {
                        success: true
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.deleteMessage(req, res);
          expect(res.status).to.have.been.calledWith(201);
          
          
        });
          it("2) test failure not found", async () => {
             const req = {
              params: {
                  messageId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const MessageService = {
                deleteMessage: async (id) => {
                    const response = {
                      success: false,
                      error:messageErrors.MESSAGE_NOT_FOUND
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.deleteMessage(req, res);
            expect(res.status).to.have.been.calledWith(404);
            expect(res.status(404).json).to.have.been.calledWith({
                message : "Message not found",
                status : "Not Found"
            })
          });
         it("3) test failure internal", async () => {
             const req = {
              params: {
                  messageId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const MessageService = {
                deleteMessage: async (id) => {
                    const response = {
                      success: false,
                      error: messageErrors.MONGO_ERR
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.deleteMessage(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({
                 message : "Internal server error", 
                 status : "Internal Server Error"
            })
         });
        it("4) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              params: {
                  messageId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const MessageService = {
                deleteMessage: async (id) => {
                    const response = {
                        success: true
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.deleteMessage(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({
                  status: "fail"
            })
          
          
        });
    });
    describe("mod message", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                messageObject: {
                    text: "hi",
                    to:"12"
                }
             };
            const MessageService = {
                modMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    return response;
                }
            };
             const NotificationService = {
                getFirebaseToken: async (id) => {
                    const response = {
                        success: true,
                        data: {
                            firebaseToken: "638bed1001f496d7284c2832"
                        }
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.modMessage(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("2) test fail no message object", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {};
            const MessageService = {};
            const NotificationService = {};
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.modMessage(req, res);
            expect(res.status).to.have.been.calledWith(400);
          
          
        });
        
        it("3)test fail in mod message", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                messageObject: {
                    text: "hi",
                    to:"12"
                }
             };
            const MessageService = {
                modMessage: async (id) => {
                    const response = {
                        success: false
                    }
                    return response;
                }
            };
            
            const on = {};
            const messageObj = new message({ on, MessageService});
            await messageObj.modMessage(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("4) test fail in firebase", async () => {
            const req = {
                messageObject: {
                    text: "hi",
                    to:"12"
                }
             };
            const MessageService = {
                modMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    return response;
                }
            };
             const NotificationService = {
                getFirebaseToken: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.modMessage(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("5) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                messageObject: {
                    text: "hi",
                    to:"12"
                }
             };
            const MessageService = {
                modMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.modMessage(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });   
        
        
     });   
    describe("create reply message", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
                post: {},
                mentions:{}
             };
            const MessageService = {
                createReplyMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    return response;
                }
            };
             
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.createReplyMessage(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("2) test fail", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {};
            
             
            const on = {};
            const messageObj = new message({ on, on });
            await messageObj.createReplyMessage(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
           it("3) test fail", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {user: {},
                comment: {},
                post: {}};
            
             
            const on = {};
            const messageObj = new message({ on, on });
            await messageObj.createReplyMessage(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
      
         it("4) test exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
                post: {},
                mentions:{}
             };
            const MessageService = {
                createReplyMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    throw new Error('divide by zero!');
                    //return response;
                }
            };
             
            const on = {};
            const messageObj = new message({ on, MessageService });
            await messageObj.createReplyMessage(req, res);
          //expect(res.status).to.have.been.calledWith(201);
          
          
        });
           
        
        
   });
  
    describe("reply", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:""
                },
                body: {
                    text:""
                },
                params: {
                    parentMessageId:""
                }
             };
            const MessageService = {
                reply: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    return response;
                }
            };
             const NotificationService = {
                getFirebaseToken: async (id) => {
                    const response = {
                        success: true,
                        data: {
                            firebaseToken: "638bed1001f496d7284c2832"
                        }
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(200);
          
          
        });
        // it("2) test fail no message object", async () => {
        //     //const FCM = ()=>{ return "b" };
        //     const req = {};
        //     const MessageService = {};
        //     const NotificationService = {};
        //     const on = {};
        //     const messageObj = new message({ on, MessageService,NotificationService });
        //     await messageObj.modMessage(req, res);
        //     expect(res.status).to.have.been.calledWith(400);
          
          
        // });
        
        // it("3)test fail in mod message", async () => {
        //     //const FCM = ()=>{ return "b" };
        //     const req = {
        //         messageObject: {
        //             text: "hi",
        //             to:"12"
        //         }
        //      };
        //     const MessageService = {
        //         modMessage: async (id) => {
        //             const response = {
        //                 success: false
        //             }
        //             return response;
        //         }
        //     };
            
        //     const on = {};
        //     const messageObj = new message({ on, MessageService});
        //     await messageObj.modMessage(req, res);
        //  // expect(res.status).to.have.been.calledWith(201);
          
          
        // });
        // it("4) test fail in firebase", async () => {
        //     const req = {
        //         messageObject: {
        //             text: "hi",
        //             to:"12"
        //         }
        //      };
        //     const MessageService = {
        //         modMessage: async (id) => {
        //             const response = {
        //                 success: true,
        //                 data: {
        //                      text: "hi",
        //                      to:"12"
        //                 }
        //             }
        //             return response;
        //         }
        //     };
        //      const NotificationService = {
        //         getFirebaseToken: async (id) => {
        //             const response = {
        //                 success: false,
        //             }
        //             return response;
        //         }
        //     };
        //     const on = {};
        //     const messageObj = new message({ on, MessageService,NotificationService });
        //     await messageObj.modMessage(req, res);
        //  // expect(res.status).to.have.been.calledWith(201);
          
          
        // });
          
          
           it("2) test bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {};
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
           });
          
           it("3) message to reply on not found", async () => {
            //const FCM = ()=>{ return "b" };
               const req = {
                user: {
                    _id:" "
                },
                body: {
                    text:" "
                },
                params: {
                    parentMessageId:" "
                }
             };
            const MessageService = {
                reply: async (id) => {
                    const response = {
                        success: false,
                        error:messageErrors.MESSAGE_NOT_FOUND
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService});
            await messageObj.reply(req, res);
               expect(res.status).to.have.been.calledWith(404);
                expect(res.status(404).json).to.have.been.calledWith({

                status: "Not Found",
            message: "Message Not Found",
       
            })
          
          
           });
           it("4) message to reply on not found", async () => {
            //const FCM = ()=>{ return "b" };
               const req = {
                user: {
                    _id:" "
                },
                body: {
                    text:" "
                },
                params: {
                    parentMessageId:" "
                }
             };
            const MessageService = {
                reply: async (id) => {
                    const response = {
                        success: false,
                        error:messageErrors.MESSAGE_NOT_FOUND_IN_INBOX
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService});
            await messageObj.reply(req, res);
               expect(res.status).to.have.been.calledWith(404);
                expect(res.status(404).json).to.have.been.calledWith({
status: "Not Found",
            message: "Message Not Found In Your Inbox",
            })
          
          
           });
                it("5) message to reply on not found", async () => {
            //const FCM = ()=>{ return "b" };
               const req = {
                user: {
                    _id:" "
                },
                body: {
                    text:" "
                },
                params: {
                    parentMessageId:" "
                }
             };
            const MessageService = {
                reply: async (id) => {
                    const response = {
                        success: false,
                      
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService});
            await messageObj.reply(req, res);
               expect(res.status).to.have.been.calledWith(500);
                expect(res.status(500).json).to.have.been.calledWith({
                status: "Internal server error",
                message: "Internal server error",
            })
          
          
        });
        it("6) test bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req =
            {
                
                body: {
                    text:" "
                },
                params: {
                    parentMessageId:" "
                }};
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
        });
          
          it("7) test bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req =
            {
                params: {
                    parentMessageId:" "
                }};
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
          });
          
           it("8) test bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req =
            {
                user: {
                    _id:" "
                },
              };
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
           });
            it("9) test bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req =
            {
               body: {
                    text:" "
                },
              };
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
           });
            it("10) test bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req =
            {
                user: {
                    _id:""
                },
               body: {
                    text:" "
                },
              };
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
            });
           it("11) test bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req =
            {
                 user: {
                    _id:" "
                },
                params: {
                    parentMessageId:" "
                }
              };
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
           });
        it("12) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:""
                },
                body: {
                    text:""
                },
                params: {
                    parentMessageId:""
                }
             };
            const MessageService = {
                reply: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
             const NotificationService = {};
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.reply(req, res);
            expect(res.status).to.have.been.calledWith(500);
             expect(res.status(500).json).to.have.been.calledWith({
                status: "fail"    
            })
          
          
        });
    });


    describe("send message", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:" "
                },
                body: {
                    text: " ",
                    subject: " ",
                    to:" "
                }
             };
            const MessageService = {
                createMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    return response;
                }
            };
             const NotificationService = {
                getFirebaseToken: async (id) => {
                    const response = {
                        success: true,
                        data: {
                            firebaseToken: "638bed1001f496d7284c2832"
                        }
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.sendMessage(req, res);
          expect(res.status).to.have.been.calledWith(200);
          
          
        });
             it("2) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                
                body: {
                    text: " ",
                    subject: " ",
                    to:" "
                }
             };
            const MessageService = {};
             const NotificationService = {};
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.sendMessage(req, res);
          expect(res.status).to.have.been.calledWith(400);
          
          
             });
             it("3) test lenght failed", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:" "
                },
                body: {
                    text: " ",
                    subject: "11111111111111111111111 ",
                    to:" "
                }
             };
            const MessageService = { };
             const NotificationService = { };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.sendMessage(req, res);
          expect(res.status).to.have.been.calledWith(400);
           expect(res.status(400).json).to.have.been.calledWith({
status: "fail",
                message: "Subject must have less or equal than 100 characters",
          
            })
          
             });
            
             it("4) test fail user not found", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:" "
                },
                body: {
                    text: " ",
                    subject: " ",
                    to:" "
                }
             };
            const MessageService = {
                createMessage: async (id) => {
                    const response = {
                        success: false,
                      error:userErrors.USER_NOT_FOUND
                    }
                    return response;
                }
            };
             const NotificationService = {};
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.sendMessage(req, res);
                 expect(res.status).to.have.been.calledWith(404);
                  expect(res.status(404).json).to.have.been.calledWith({
           status: "Not Found",
            message: "User Not Found",
            })
          
          
             });
            
            it("5) test fail internal", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:" "
                },
                body: {
                    text: " ",
                    subject: " ",
                    to:" "
                }
             };
            const MessageService = {
                createMessage: async (id) => {
                    const response = {
                        success: false,
                     
                    }
                    return response;
                }
            };
             const NotificationService = {};
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.sendMessage(req, res);
                 expect(res.status).to.have.been.calledWith(500);
                  expect(res.status(500).json).to.have.been.calledWith({
                status: "Internal server error",
                 message: "Internal server error",
            })
          
          
            });
             it("6) test token ", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:" "
                },
                body: {
                    text: " ",
                    subject: " ",
                    to:" "
                }
             };
            const MessageService = {
                createMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    return response;
                }
            };
             const NotificationService = {
                getFirebaseToken: async (id) => {
                     const response = {
                         success: false,
                     }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.sendMessage(req, res);
          expect(res.status).to.have.been.calledWith(200);
          
          
        });
        it("7) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                user: {
                    _id:" "
                },
                body: {
                    text: " ",
                    subject: " ",
                    to:" "
                }
             };
            const MessageService = {
                createMessage: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                             to:"12"
                        }
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
            };
             const NotificationService = {
                getFirebaseToken: async (id) => {
                    const response = {
                        success: true,
                        data: {
                            firebaseToken: "638bed1001f496d7284c2832"
                        }
                    }
                    return response;
                }
            };
            const on = {};
            const messageObj = new message({ on, MessageService,NotificationService });
            await messageObj.sendMessage(req, res);
            expect(res.status).to.have.been.calledWith(500);
             expect(res.status(500).json).to.have.been.calledWith({
                 status: "fail"
            })
          
          
        });
    });

  


  
 });
