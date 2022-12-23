const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
dotenv.config();
const notification = require("./../../controllers/notificationController");
const { notificationErrors } = require("./../../error_handling/errors");

// const proxyquire = require("proxyquire");
// const fcm = proxyquire("../controllers/notificationController.js", {
//   "FCM": {
  
//   }
// });


chai.use(sinonChai);

const statusJsonSpy = sinon.spy();
const next = sinon.spy();

const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};
describe("notification test",()=> {
    describe("get notifications test", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                getAllNotifications: async (id) => {
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.getAllNotifications(req, res);
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
            const NotificationService = {
                getAllNotifications: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.getAllNotifications(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
       it("3) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                getAllNotifications: async (id) => {
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.getAllNotifications(req, res);
            expect(res.status).to.have.been.calledWith(500);
            
        });
    });
  
    describe("mark all as read test", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                markAllNotificationsAsRead: async (id) => {
                    const response = {
                        success: true
                    }
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.markAllNotificationsAsRead(req, res);
            expect(res.status).to.have.been.calledWith(201);
          expect(res.status(201).json).to.have.been.calledWith({});
        });
          it("2) test failure", async () => {
            const req = {
                
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                markAllNotificationsAsRead: async (id) => {
                    const response = {
                        success: false,
                    }
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.markAllNotificationsAsRead(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(500).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
          });
       it("3) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                markAllNotificationsAsRead: async (id) => {
                    const response = {
                        success: true
                }
                throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.markAllNotificationsAsRead(req, res);
            expect(res.status).to.have.been.calledWith(500);
          //expect(res.status(201).json).to.have.been.calledWith({});
        });
    });
  
    describe("mark one notification as read test", () => {  
        it("1) test success", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              params: {
                  notificationId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                markNotificationAsRead: async (id) => {
                    const response = {
                        success: true
                    }
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.markNotificationAsRead(req, res);
          expect(res.status).to.have.been.calledWith(201);
          
          
        });
          it("2) test failure not found", async () => {
             const req = {
              params: {
                  notificationId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                markNotificationAsRead: async (id) => {
                    const response = {
                      success: false,
                      error:notificationErrors.NOTIFICATION_NOT_FOUND
                    }
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.markNotificationAsRead(req, res);
            expect(res.status).to.have.been.calledWith(404);
            expect(res.status(404).json).to.have.been.calledWith({
                message : "Notification not found",
                status : "Not Found"
            })
          });
         it("3) test failure internal", async () => {
             const req = {
              params: {
                  notificationId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                markNotificationAsRead: async (id) => {
                    const response = {
                      success: false,
                      error:notificationErrors.MONGO_ERR
                    }
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.markNotificationAsRead(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(404).json).to.have.been.calledWith({
                 message : "Internal server error",
            
            status : "Internal Server Error"
            })
         });
       it("4) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              params: {
                  notificationId:"123"
                },
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                
            };
            const NotificationService = {
                markNotificationAsRead: async (id) => {
                    const response = {
                        success: true
                }
                throw new Error('divide by zero!');
                    return response;
                }
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.markNotificationAsRead(req, res);
          expect(res.status).to.have.been.calledWith(500);
          
          
        });
    });
    describe("hide one notification", () => {  
          it("1) test success", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                params: {
                    notificationId:"123"
                  },
                      // flairId: "638bed1001f496d7284c2832",
                      user: { _id: "125" }
                  
              };
              const NotificationService = {
                  hideNotification: async (id) => {
                      const response = {
                          success: true
                      }
                      return response;
                  }
              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.hideNotification(req, res);
            expect(res.status).to.have.been.calledWith(201);
            
            
          });
            it("2) test failure not found", async () => {
              const req = {
                params: {
                    notificationId:"123"
                  },
                      // flairId: "638bed1001f496d7284c2832",
                      user: { _id: "125" }
                  
              };
              const NotificationService = {
                  hideNotification: async (id) => {
                      const response = {
                        success: false,
                        error:notificationErrors.NOTIFICATION_NOT_FOUND
                      }
                      return response;
                  }
              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.hideNotification(req, res);
              expect(res.status).to.have.been.calledWith(404);
              expect(res.status(404).json).to.have.been.calledWith({
                  message : "Notification not found",
                  status : "Not Found"
              })
            });
          it("3) test failure internal", async () => {
              const req = {
                params: {
                    notificationId:"123"
                  },
                      // flairId: "638bed1001f496d7284c2832",
                      user: { _id: "125" }
                  
              };
              const NotificationService = {
                  hideNotification: async (id) => {
                      const response = {
                        success: false,
                        error:notificationErrors.MONGO_ERR
                      }
                      return response;
                  }
              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.hideNotification(req, res);
              expect(res.status).to.have.been.calledWith(500);
              expect(res.status(404).json).to.have.been.calledWith({
                  message : "Internal server error",
              
              status : "Internal Server Error"
              })
          });
      it("4) test fail exception", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                params: {
                    notificationId:"123"
                  },
                      // flairId: "638bed1001f496d7284c2832",
                      user: { _id: "125" }
                  
              };
              const NotificationService = {
                  hideNotification: async (id) => {
                      const response = {
                          success: true
                  }
                  throw new Error('divide by zero!');
                      return response;
                  }
              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.hideNotification(req, res);
            expect(res.status).to.have.been.calledWith(500);
            
            
          });
    }); 
    describe("add firebase token", () => {  
          it("1) test success", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                body: {
                    token:"123"
                  },
                      // flairId: "638bed1001f496d7284c2832",
                      user: { _id: "125" }
                  
              };
              const NotificationService = {
                  saveFirebaseToken: async (id) => {
                      const response = {
                          success: true
                      }
                      return response;
                  }
              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFirebaseToken(req, res);
            expect(res.status).to.have.been.calledWith(201);
            
            
          });
            it("2) test invalid request", async () => {
              const req = {
                body: {
                  
                  },
                user: { _id: "125" }
                  
              };
              const NotificationService = {};
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFirebaseToken(req, res);
              expect(res.status).to.have.been.calledWith(400);
              expect(res.status(400).json).to.have.been.calledWith({
                  status: "fail",
                  message: "Invalid request"
              })
            });
          it("3) test failure internal", async () => {
              const req = {
                body: {
                    token:"123"
                  },
                      // flairId: "638bed1001f496d7284c2832",
                      user: { _id: "125" }
                  
              };
              const NotificationService = {
                  saveFirebaseToken: async (id) => {
                      const response = {
                        success: false
                      }
                      return response;
                  }
              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFirebaseToken(req, res);
              expect(res.status).to.have.been.calledWith(500);
              expect(res.status(404).json).to.have.been.calledWith({
                  message : "Internal server error",
                  status : "Internal Server Error"
              })
          });
      it("4) test fail exception", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                body: {
                    token:"123"
                  },
                      // flairId: "638bed1001f496d7284c2832",
                      user: { _id: "125" }
                  
              };
              const NotificationService = {
                  saveFirebaseToken: async (id) => {
                      const response = {
                          success: true
                  }
                  throw new Error('divide by zero!');
                      return response;
                  }
              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFirebaseToken(req, res);
            expect(res.status).to.have.been.calledWith(500);
            
            
          });
    });
   describe("create reply notification", () => {  
        it("1) test success (postReply)", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                          to: "12",
                             type:"postReply"
                        }
                    }
                    return response;
              },
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("2) test success (commentReply)", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                          to: "12",
                             type:"userMention"
                        }
                    }
                    return response;
              },
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
           
         it("3) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},               
             };            
            const on = {};
            const notificationObj = new notification({ on, on });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
         });
        it("4) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                comment: {},             
             };            
            const on = {};
            const notificationObj = new notification({ on, on });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("5) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                 post: {}            
             };            
            const on = {};
            const notificationObj = new notification({ on, on });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("6) test fail in reply notification creation", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: false,
                       
                    }
                    return response;
              }
              
            };
             
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
      it("7) test fail in token ", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                          to: "12",
                             type:"postReply"
                        }
                    }
                    return response;
              },
               getFirebaseToken: async (id) => {
                    const response = {
                        success: false,
                        
                    }
                    return response;
                }
              
            };
             
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
      });
     it("8) test mention case", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {},
              mentions:{}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: false,
                        data: {
                             text: "hi",
                          to: "12",
                             type:"postReply"
                        }
                    }
                    return response;
              },
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
            const notificationObj = new notification({ on, NotificationService });
       notificationObj.sendMentions = async () => { return; };
       await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
     });
     it("9) test fail exception", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {},
              mentions:{}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: false,
                        data: {
                             text: "hi",
                          to: "12",
                             type:"postReply"
                        }
                }
                throw new Error('divide by zero!');
                    return response;
              }
            };
             
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
       notificationObj.sendMentions = async () => { return; };
       await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
     });
     it("10) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              comment:{},
                 post: {}            
             };            
            const on = {};
            const notificationObj = new notification({ on, on });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
     });
      it("11) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              user:{},
                 post: {}            
             };            
            const on = {};
            const notificationObj = new notification({ on, on });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
      });
      it("12) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              user:{},
                 comment: {}            
             };            
            const on = {};
            const notificationObj = new notification({ on, on });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
      });
       it("13) test fail bad request", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
                         
             };            
            const on = {};
            const notificationObj = new notification({ on, on });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
       it("14) test success not post or comment reply", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                          to: "12",
                             type:"postReply"
                        }
                    }
                    return response;
              },
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
        });
        it("15) test fail in token ", async () => {
            //const FCM = ()=>{ return "b" };
            const req = {
              
                user: {},
                comment: {},
              post: {},
              mentions:{}
                
             };
            const NotificationService = {
                addReplyNotification: async (id) => {
                    const response = {
                        success: true,
                        data: {
                             text: "hi",
                          to: "12",
                             type:"postReply"
                        }
                    }
                    return response;
              },
               getFirebaseToken: async (id) => {
                    const response = {
                        success: false,
                        
                    }
                    return response;
                }
              
            };
             
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
              notificationObj.sendMentions = async () => { return; };
            await notificationObj.addReplyNotification(req, res);
         // expect(res.status).to.have.been.calledWith(201);
          
          
      });
   });
    describe("add follow notification", () => {  
          it("1) test success", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                follower: {_id:"1"},
                followed: {_id:" 2"  }
                  
              };
              const NotificationService = {
                  addFollowNotification: async (id) => {
                      const response = {
                          success: true
                      }
                      return response;
                  },
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
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
           it("2) test bad request", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                
                followed: {_id:" 2"  }
                  
              };
              const NotificationService = {};
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
            it("3) test bad request", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                follower: {_id:"1"},
                  
              };
              const NotificationService = {};
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
            it("4) test bad request", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {};
              const NotificationService = {};
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
           it("5) test fail in notification creation", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                follower: {_id:"1"},
                followed: {_id:" 2"  }
                  
              };
              const NotificationService = {
                  addFollowNotification: async (id) => {
                      const response = {
                          success: false
                      }
                      return response;
                  }};
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
           it("6) test fail in getting token", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                follower: {_id:"1"},
                followed: {_id:" 2"  }
                  
              };
              const NotificationService = {
                  addFollowNotification: async (id) => {
                      const response = {
                          success: true
                      }
                      return response;
                  },
                   getFirebaseToken: async (id) => {
                    const response = {
                        success: false,
                      }
                    return response;
                }
              

              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
           it("7) test exception", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                follower: {_id:"1"},
                followed: {_id:" 2"  }
                  
              };
              const NotificationService = {
                  addFollowNotification: async (id) => {
                      const response = {
                          success: true
                      }
throw new Error('divide by zero!');
                      return response;
                      
                  },
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
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
               it("8) test exception", async () => {
              //const FCM = ()=>{ return "b" };
              const req = {
                follower: {_id:"1"},
                followed: {_id:" 2"  }
                  
              };
              const NotificationService = {
                  addFollowNotification: async (id) => {
                      const response = {
                          success: true
                      }

                      return response;
                      
                  },
                   getFirebaseToken: async (id) => {
                    const response = {
                        success: true,
                        data: {
                            firebaseToken: "638bed1001f496d7284c2832"
                        }
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
              

              };
              const on = {};
              const notificationObj = new notification({ on, NotificationService });
              await notificationObj.addFollowNotification(req, res);
            //expect(res.status).to.have.been.calledWith(201);
            
            
          });
           
    });
     describe("send mentions", () => {  
        it("1) test success", async () => {
            const req = {
                    user: { _id: "125" }
                
            };
            const user={
                _id:" "
            };
             const mentions=[
               { userId:"12"}
           ] ;
            const NotificationService = {
                sendMentions: async (id) => {
                    const response = {
                        success: true,
                        data:[
                            {}]
                    }
                    return response;
                },
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.sendMentions(user,on,on, mentions);
            
        });
      it("2) test no notifiaction", async () => {
            const req = {
                    user: { _id: "125" }
                
            };
            const user={
                _id:" "
            };
             const mentions=[
               { userId:"12"}
           ] ;
            const NotificationService = {
                sendMentions: async (id) => {
                    const response = {
                        success: false,
                       
                    }
                    return response;
                }
              
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.sendMentions(user,on,on, mentions);
            
        });
        it("3) test no notifications existing", async () => {
            const req = {
                    user: { _id: "125" }
                
            };
            const user={
                _id:" "
            };
             const mentions=[
               { userId:"12"}
           ] ;
            const NotificationService = {
                sendMentions: async (id) => {
                    const response = {
                        success: true,
                        data:[]
                    }
                    return response;
                }
              
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.sendMentions(user,on,on, mentions);
            
        });
         it("4) test same id and success ", async () => {
            const req = {
                    user: { _id: "125" }
                
            };
            const user={
                _id:"12"
            }
            const mentions=[
               { userId:"12"}
           ] ;
            const NotificationService = {
                sendMentions: async (id) => {
                    const response = {
                        success: true,
                        data:[
                            {}]
                    }
                    return response;
                },
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.sendMentions(user,on,on, mentions);
            
        });
         
         it("5) test defferent id and success ", async () => {
            const req = {
                    user: { _id: "125" }
                
            };
            const user={
                _id:"124"
            }
            const mentions=[
               { userId:"12"}
           ] ;

            const NotificationService = {
                sendMentions: async (id) => {
                    const response = {
                        success: true,
                        data:[
                            {}
                           ]
                    }
                    return response;
                },
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
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.sendMentions(user,on,on, mentions);
            
        });
         it("6) test different id and fail", async () => {
            const req = {
                    user: { _id: "125" }
                
            };
            const user={
                _id:"132"
            }
            const mentions=[
               { userId:"12"}
           ] ;

            const NotificationService = {
                sendMentions: async (id) => {
                    const response = {
                        success: true,
                        data:[
                            {},
                           ]
                    }
                    return response;
                },
                  getFirebaseToken: async (id) => {
                    const response = {
                        success: false
                    }
                    return response;
                }
              
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.sendMentions(user,on,on, mentions);
            
        });
         it("7) test fail exception", async () => {
            const req = {
                    user: { _id: "125" }
                
            };
            const user={
                _id:"132"
            }
            const mentions=[
               { userId:"12"}
           ] ;

            const NotificationService = {
                sendMentions: async (id) => {
                    const response = {
                        success: true,
                        data:[
                            {},
                           ]
                    }

                    return response;
                },
                  getFirebaseToken: async (id) => {
                    const response = {
                        success: false
                    }
                    throw new Error('divide by zero!');
                    return response;
                }
              
            };
            const on = {};
            const notificationObj = new notification({ on, NotificationService });
            await notificationObj.sendMentions(user,on,on, mentions);
            
        });
    });

 });
