const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
const subreddit = require("./../../controllers/notificationController");
const { notificationErrors } = require("./../../error_handling/errors");
dotenv.config();
chai.use(sinonChai);
// const auth = () => {
//     return { accountKey: "{ uid: null }" };
// }
// jest.spyOn(FCM, 'auth').mockImplementation(auth);
// const proxyquire = require("proxyquire");

//var res = { send: sinon.spy() ,status: sinon.spy(),json: sinon.spy()};
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
            const FCM = ()=>{ return "b" };
            const req = {
                params: {
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                }
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
            const notificationObj = new subreddit({ on, NotificationService });
            await notificationObj.getAllNotifications(req, res);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status(200).json).to.have.been.calledWith({

                status: "OK",
                data: [{
                    _id: "638bed1001f496d7284c2832",
                }]
            })
        });
          it("2) test failure", async () => {
            const req = {
                params: {
                    // flairId: "638bed1001f496d7284c2832",
                    user: { _id: "125" }
                }
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
            const notificationObj = new subreddit({ on, NotificationService });
            await notificationObj.getAllNotifications(req, res);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.status(200).json).to.have.been.calledWith({

                 status: "Internal server error",
          message: "Internal server error",
       
            })
        });
    });


    //  describe("get flair test", () => {
    //     it("1) test success", async () => {
    //         const req = {
    //             params: {
    //                  flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             }
    //         };
    //         const subredditService = {
    //             getFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: true,
    //                     data: {
    //                         _id: "638bed1001f496d7284c2832",
    //                         text: "first flair"
    //                     }
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.getFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(200);
    //         expect(res.status(200).json).to.have.been.calledWith({

    //             status: "OK",
    //             data: {
    //                _id: "638bed1001f496d7284c2832",
    //                         text: "first flair"
    //             }
    //         })
    //     });
    //     it("2) test subreddit not found", async () => {
    //         const req = {
    //             params: {
    //                 flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             }
    //         };
    //         const subredditService = {
    //             getFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.SUBREDDIT_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.getFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Subreddit not found"
    //         })
    //     });
    //      it("3) test flair not found", async () => {
    //         const req = {
    //             params: {
    //                 flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             }
    //         };
    //         const subredditService = {
    //             getFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.FLAIR_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.getFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Flair not found"
    //         })
    //     });
    //     it("4) test missing input", async () => {
    //         const req = {
    //             params: {
                   
    //             }
    //         };
            
    //         const on = {};
    //         const subredditObj = new subreddit({ on, on });
    //         await subredditObj.getFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(400);
    //         expect(res.status(400).json).to.have.been.calledWith({

    //             status: "fail",
    //             message: "Missing required parameter"
    //         })
    //     });
    //  });
    
    //   describe("delete flair test", () => {
    //     it("1) test success", async () => {
    //         const req = {
    //             params: {
    //                  flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //              user :{
    //                 _id:" "
    //             }
    //         };
    //         const subredditService = {
    //             deleteFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: true,
                       
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.deleteFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(204);
           
    //     });
    //     it("2) test not moderator", async () => {
    //         const req = {
    //             params: {
    //                  flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //              user :{
    //                 _id:" "
    //             }
    //         };
    //         const subredditService = {
    //             deleteFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                    error :subredditErrors.NOT_MODERATOR
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.deleteFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(403);
    //         expect(res.status(403).json).to.have.been.calledWith({

    //             status :"Forbidden",
    //             message :"Not a subreddit moderator"
    //         })
    //     });
          
        
    //        it("3) test subreddit not found", async () => {
    //         const req = {
    //             params: {
    //                  flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //               user :{
    //                 _id:" "
    //             }
    //         };
    //         const subredditService = {
    //             deleteFlair: async (subredditName) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.SUBREDDIT_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.deleteFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Subreddit not found"
    //         })
    //     });
                    
           
          
        
       
    //      it("4) test flair not found", async () => {
    //         const req = {
    //             params: {
    //                 flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //               user :{
    //                 _id:" "
    //             }
    //         };
    //         const subredditService = {
    //             deleteFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.FLAIR_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.deleteFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Flair not found"
    //         })
    //     });
    //     it("5) test missing input", async () => {
    //         const req = {
    //             params: {
                   
    //             },
    //               user :{
    //                 _id:" "
    //             }
    //         };
            
    //         const on = {};
    //         const subredditObj = new subreddit({ on, on });
    //         await subredditObj.deleteFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(400);
    //         expect(res.status(400).json).to.have.been.calledWith({

    //             status: "fail",
    //             message: "Missing required parameter"
    //         })
    //     });
    //   });
    
    //   describe("update flair test", () => {
    //     it("1) test success", async () => {
    //         const req = {
    //             params: {
    //                  flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //              user :{
    //                 _id:" "
    //             },
    //             body: {
    //                  text:"new text"
    //              }
    //         };
    //         const subredditService = {
    //             updateFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: true,
    //                     data: {
    //                         _id: "638bed1001f496d7284c2832",
    //                         text:"new text"
    //                    }
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.updateFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(200);
    //         expect(res.status(200).json).to.have.been.calledWith({

    //             status: "OK",
    //             data: {
    //                _id: "638bed1001f496d7284c2832",
    //                         text:"new text"
    //             }
    //         })
    //     });
           
       
    //     it("2) test not moderator", async () => {
    //         const req = {
    //             params: {
    //                  flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //              user :{
    //                 _id:" "
    //             }
    //         };
    //         const subredditService = {
    //             updateFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                    error :subredditErrors.NOT_MODERATOR
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.updateFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(403);
    //         expect(res.status(403).json).to.have.been.calledWith({

    //             status :"Forbidden",
    //             message :"Not a subreddit moderator"
    //         })
    //     });
          
        
    //        it("3) test subreddit not found", async () => {
    //         const req = {
    //             params: {
    //                  flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //               user :{
    //                 _id:" "
    //             }
    //         };
    //         const subredditService = {
    //             updateFlair: async (subredditName) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.SUBREDDIT_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.updateFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Subreddit not found"
    //         })
    //     });
                    
           
          
        
       
    //      it("4) test flair not found", async () => {
    //         const req = {
    //             params: {
    //                 flairId: "638bed1001f496d7284c2832",
    //                 subredditName: "Nonlegit"
    //             },
    //               user :{
    //                 _id:" "
    //             }
    //         };
    //         const subredditService = {
    //             updateFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.FLAIR_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.updateFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Flair not found"
    //         })
    //     });
    //     it("5) test missing input", async () => {
    //         const req = {
    //             params: {
                   
    //             },
    //               user :{
    //                 _id:" "
    //             }
    //         };
            
    //         const on = {};
    //         const subredditObj = new subreddit({ on, on });
    //         await subredditObj.updateFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(400);
    //         expect(res.status(400).json).to.have.been.calledWith({

    //             status: "fail",
    //             message: "Missing required parameter"
    //         })
    //     });
    //   });
    //  describe("create flair test", () => {
    //     it("1) test success", async () => {
    //         const req = {
    //             params: {
                     
    //                 subredditName: "Nonlegit"
    //             },
    //              user :{
    //                 _id:" "
    //             },
    //             body: {
    //                  text:"new text"
    //              }
    //         };
    //         const subredditService = {
    //             createFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: true,
    //                     data: {
    //                         _id: "638bed1001f496d7284c2832",
    //                         text:"new text"
    //                    }
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.createFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(200);
    //         expect(res.status(200).json).to.have.been.calledWith({

    //             status: "OK",
    //             data: {
    //                _id: "638bed1001f496d7284c2832",
    //                         text:"new text"
    //             }
    //         })
    //     });
           
       
    //     it("2) test not moderator", async () => {
    //         const req = {
    //             params: {
                    
    //                 subredditName: "Nonlegit"
    //             },
    //              user :{
    //                 _id:" "
    //             },
    //             body: {
    //                  text:"hello"
    //              }
    //         };
    //         const subredditService = {
    //             createFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                    error :subredditErrors.NOT_MODERATOR
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.createFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(403);
    //         expect(res.status(403).json).to.have.been.calledWith({

    //             status :"Forbidden",
    //             message :"Not a subreddit moderator"
    //         })
    //     });
          
        
    //        it("3) test subreddit not found", async () => {
    //         const req = {
    //             params: {
                    
    //                 subredditName: "Nonlegit"
    //             },
    //               user :{
    //                 _id:" "
    //             },
    //                body: {
    //                  text:"hello"
    //              }
    //         };
    //         const subredditService = {
    //             createFlair: async (subredditName) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.SUBREDDIT_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.createFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Subreddit not found"
    //         })
    //     });
                    
           
          
        
       
    //      it("4) test flair not found", async () => {
    //         const req = {
    //             params: {
                   
    //                 subredditName: "Nonlegit"
    //             },
    //               user :{
    //                 _id:" "
    //             },
    //                body: {
    //                  text:"hello"
    //              }
    //         };
    //         const subredditService = {
    //             createFlair: async (subredditName,flairId) => {
    //                 const response = {
    //                     success: false,
    //                     error: subredditErrors.FLAIR_NOT_FOUND
    //                 }
    //                 return response;
    //             }
    //         };
    //         const on = {};
    //         const subredditObj = new subreddit({ subredditService, on });
    //         await subredditObj.createFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(404);
    //         expect(res.status(404).json).to.have.been.calledWith({

    //             status: "Not Found",
    //             message: "Flair not found"
    //         })
    //     });
    //     it("5) test missing input", async () => {
    //         const req = {
    //             params: {
                   
    //             },
    //               user :{
    //                 _id:" "
    //             },
    //                body: {
    //                  text:"hello"
    //              }
    //         };
            
    //         const on = {};
    //         const subredditObj = new subreddit({ on, on });
    //         await subredditObj.createFlair(req, res);
    //         expect(res.status).to.have.been.calledWith(400);
    //         expect(res.status(400).json).to.have.been.calledWith({

    //             status: "fail",
    //             message: "Missing required parameter"
    //         })
    //     });
    //   });
    

 });
