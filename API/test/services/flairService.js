const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const { subredditErrors,mongoErrors } = require("./../../error_handling/errors");
dotenv.config({ path: "config/config.env" });

 const SubredditService = require("./../../service/subredditService");

// const emailServiceObj = {
//   sendPasswordReset: (user, resetURL) => {
//     return true;
//   },
//   sendUserName: (user) => {
//     return true;
//   },
// };

describe("get subreddit flair", () => {
  
    it("1) test success", async () => {
      const SubredditRepository = {
        getSubredditFlairs: async(subredditName) => {
          const response = {
            success: true,
            doc: 
              [{
              _id:mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
              text: "first flair",
              __v: 0
            }]
            
            
          };
          
          return response;
        },
      };
      const on = {};
      const subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
      const subredditName = " ";
      const flairId= mongoose.Types.ObjectId("636e901bbc485bd111dd3880");
      const result = await subredditServiceObj.getFlair(subredditName,flairId);
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first flair");
      
    });
     it("2) test subreddit not found", async () => {
      const SubredditRepository = {
        getSubredditFlairs: async(subredditName) => {
          const response = {
             success: false, error: mongoErrors.NOT_FOUND
          };
          
          return response;
        },
      };
      const on = {};
      const subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
       const subredditName = " ";
       const flairId=""
      const result = await subredditServiceObj.getFlair(subredditName,flairId);
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( subredditErrors.SUBREDDIT_NOT_FOUND);
      
    });
    it("3) test flair not found", async () => {
      const SubredditRepository = {
        getSubredditFlairs: async(subredditName) => {
          const response = {
            success: true,
            doc: 
              [{
              _id:mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
              text: "first flair",
              __v: 0
            }]
            
            
          };
          
          return response;
        },
      };
      const on = {};
      const subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
      const subredditName = " ";
      const flairId= mongoose.Types.ObjectId("636e901bbc48533bd1113880");
      const result = await subredditServiceObj.getFlair(subredditName,flairId);
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( subredditErrors.FLAIR_NOT_FOUND);
      
    });
});
  describe("update subreddit flairs", () => {
  
    it("1) test success", async () => {
      const FlairRepository = {
        updateFlair: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
      const on = {};
      let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        
        return resp;
      };
      const result = await subredditServiceObj.updateFlair(subredditName);
      expect(result.success).to.equal(true);
      expect(result.data.text).to.equal( "first flair");
      
    });
    it("2) test subreddit not found ", async () => {
      const FlairRepository = {
        updateFlair: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
      const on = {};
      let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: false,
          error:subredditErrors.SUBREDDIT_NOT_FOUND
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        
        return resp;
      };
      const result = await subredditServiceObj.updateFlair(subredditName);
      expect(result.success).to.equal(false);
     
      
    });
      it("3) test not moderator", async () => {
      const FlairRepository = {
        updateFlair: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
          
    
      const on = {};
      let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: true,
           doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
           success: false, error: subredditErrors.NOT_MODERATOR
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        
        return resp;
      };
      const result = await subredditServiceObj.updateFlair(subredditName);
      expect(result.success).to.equal(false);
     
      
      });
      it("4) test not subreddit flair", async () => {
      const FlairRepository = {
        updateFlair: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
          
    
      const on = {};
      let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: true,
           doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
           success: true,
           doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
        success: false, error: subredditErrors.FLAIR_NOT_FOUND
        };
        
        return resp;
      };
      const result = await subredditServiceObj.updateFlair(subredditName);
      expect(result.success).to.equal(false);
     
      
    });
   
});
 describe("delete subreddit flair", () => {
  
    it("1) test success", async () => {
      const SubredditRepository = {
        removeFlairFromSubreddit: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
      const on = {};
      let subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        
        return resp;
      };
      const result = await subredditServiceObj.deleteFlair(subredditName);
      expect(result.success).to.equal(true);
      
      
    });
    it("2) test subreddit not found ", async () => {
      const  SubredditRepository = {
        removeFlairFromSubreddit: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
      const on = {};
      let subredditServiceObj = new SubredditService({  SubredditRepository,on,  on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: false,
          error:subredditErrors.SUBREDDIT_NOT_FOUND
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        
        return resp;
      };
      const result = await subredditServiceObj.deleteFlair(subredditName);
      expect(result.success).to.equal(false);
     
      
    });
      it("3) test not moderator", async () => {
      const  SubredditRepository = {
        removeFlairFromSubreddit: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
          
    
      const on = {};
      let subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: true,
           doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
           success: false, error: subredditErrors.NOT_MODERATOR
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
          success: true,
          doc: {
            _id: "12345",
            fixedName: "Nonlegit",
            moderators: [{
              id: "12345"
            }]
          }
        };
        
        return resp;
      };
      const result = await subredditServiceObj.deleteFlair(subredditName);
      expect(result.success).to.equal(false);
     
      
      });
      it("4) test not subreddit flair", async () => {
      const  SubredditRepository = {
        updateFlair: async(userData,data) => {
          const response = {
            success: true,
            doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
          };
          
          return response;
        },
      };
          
    
      const on = {};
      let subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
      const subredditName = " ";
      subredditServiceObj.checkSubreddit = async (subredditName) => {
        const resp = {
          success: true,
           doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
        };
        return resp;
      };
      subredditServiceObj.checkModerator = (subreddit,userID) => {
        const resp = {
           success: true,
           doc: {
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }
        };
        return resp;
      };
      subredditServiceObj.checkFlair=(subreddit,flairID) => {
        const resp = {
        success: false, error: subredditErrors.FLAIR_NOT_FOUND
        };
        
        return resp;
      };
      const result = await subredditServiceObj.deleteFlair(subredditName);
      expect(result.success).to.equal(false);
     
      
    });
   
 });

describe("get subreddit flairs", () => {
  
    it("1) test success", async () => {
      const SubredditRepository = {
        getSubredditFlairs: async(subredditName) => {
          const response = {
            success: true,
            doc: [{
              _id: "636e901bbc485bd111dd3880",
              text: "first flair",
              __v: 0
            }]
            
            
          };
          
          return response;
        },
      };
      const on = {};
      const subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
      const subredditName = " ";
      
      const result = await subredditServiceObj.getFlairs(subredditName);
      expect(result.success).to.equal(true);
      expect(result.data[0].text).to.equal( "first flair");
      
    });
     it("2) test subreddit not found", async () => {
      const SubredditRepository = {
        getSubredditFlairs: async(subredditName) => {
          const response = {
             success: false, error: mongoErrors.NOT_FOUND
          };
          
          return response;
        },
      };
      const on = {};
      const subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
      const subredditName = " ";
      const result = await subredditServiceObj.getFlairs(subredditName);
      expect(result.success).to.equal(false);
      expect(result.error).to.equal( subredditErrors.SUBREDDIT_NOT_FOUND);
      
     });
  
   
});








//   describe("get subreddit flair", () => {
  
//     it("1) test success", async () => {
//       const FlairRepository = {
//         findById: async(userData,data) => {
//           const response = {
//             success: true,
//             doc: {
//               _id: "636e901bbc485bd111dd3880",
//               text: "first flair",
//               __v: 0
//             }
//           };
          
//           return response;
//         },
//       };
//       const on = {};
//       let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
//       const subredditName = " ";
//       subredditServiceObj.checkSubreddit = async (subredditName) => {
//         const resp = {
//           success: true,
//           doc: {
//             _id: "12345",
//             fixedName: "Nonlegit",
//             moderators: [{
//               id: "12345"
//             }]
//           }
//         };
//         return resp;
//       };
//       subredditServiceObj.checkModerator = (subreddit,userID) => {
//         const resp = {
//           success: true,
//           doc: {
//             _id: "12345",
//             fixedName: "Nonlegit",
//             moderators: [{
//               id: "12345"
//             }]
//           }
//         };
//         return resp;
//       };
//       subredditServiceObj.checkFlair=(subreddit,flairID) => {
//         const resp = {
//           success: true,
//           doc: {
//             _id: "12345",
//             fixedName: "Nonlegit",
//             moderators: [{
//               id: "12345"
//             }]
//           }
//         };
        
//         return resp;
//       };
//       const result = await subredditServiceObj.updateFlair(subredditName);
//       expect(result.success).to.equal(true);
//       expect(result.data.text).to.equal( "first flair");
      
//     });
//     it("2) test subreddit not found ", async () => {
//       const FlairRepository = {
//         updateFlair: async(userData,data) => {
//           const response = {
//             success: true,
//             doc: {
//               _id: "636e901bbc485bd111dd3880",
//               text: "first flair",
//               __v: 0
//             }
//           };
          
//           return response;
//         },
//       };
//       const on = {};
//       let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
//       const subredditName = " ";
//       subredditServiceObj.checkSubreddit = async (subredditName) => {
//         const resp = {
//           success: false,
//           error:subredditErrors.SUBREDDIT_NOT_FOUND
//         };
//         return resp;
//       };
//       subredditServiceObj.checkModerator = (subreddit,userID) => {
//         const resp = {
//           success: true,
//           doc: {
//             _id: "12345",
//             fixedName: "Nonlegit",
//             moderators: [{
//               id: "12345"
//             }]
//           }
//         };
//         return resp;
//       };
//       subredditServiceObj.checkFlair=(subreddit,flairID) => {
//         const resp = {
//           success: true,
//           doc: {
//             _id: "12345",
//             fixedName: "Nonlegit",
//             moderators: [{
//               id: "12345"
//             }]
//           }
//         };
        
//         return resp;
//       };
//       const result = await subredditServiceObj.updateFlair(subredditName);
//       expect(result.success).to.equal(false);
     
      
//     });
//       it("3) test not moderator", async () => {
//       const FlairRepository = {
//         updateFlair: async(userData,data) => {
//           const response = {
//             success: true,
//             doc: {
//               _id: "636e901bbc485bd111dd3880",
//               text: "first flair",
//               __v: 0
//             }
//           };
          
//           return response;
//         },
//       };
          
    
//       const on = {};
//       let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
//       const subredditName = " ";
//       subredditServiceObj.checkSubreddit = async (subredditName) => {
//         const resp = {
//           success: true,
//            doc: {
//               _id: "636e901bbc485bd111dd3880",
//               text: "first flair",
//               __v: 0
//             }
//         };
//         return resp;
//       };
//       subredditServiceObj.checkModerator = (subreddit,userID) => {
//         const resp = {
//            success: false, error: subredditErrors.NOT_MODERATOR
//         };
//         return resp;
//       };
//       subredditServiceObj.checkFlair=(subreddit,flairID) => {
//         const resp = {
//           success: true,
//           doc: {
//             _id: "12345",
//             fixedName: "Nonlegit",
//             moderators: [{
//               id: "12345"
//             }]
//           }
//         };
        
//         return resp;
//       };
//       const result = await subredditServiceObj.updateFlair(subredditName);
//       expect(result.success).to.equal(false);
     
      
//       });
//       it("4) test not subreddit flair", async () => {
//       const FlairRepository = {
//         updateFlair: async(userData,data) => {
//           const response = {
//             success: true,
//             doc: {
//               _id: "636e901bbc485bd111dd3880",
//               text: "first flair",
//               __v: 0
//             }
//           };
          
//           return response;
//         },
//       };
          
    
//       const on = {};
//       let subredditServiceObj = new SubredditService({ on, FlairRepository, on});
//       const subredditName = " ";
//       subredditServiceObj.checkSubreddit = async (subredditName) => {
//         const resp = {
//           success: true,
//            doc: {
//               _id: "636e901bbc485bd111dd3880",
//               text: "first flair",
//               __v: 0
//             }
//         };
//         return resp;
//       };
//       subredditServiceObj.checkModerator = (subreddit,userID) => {
//         const resp = {
//            success: true,
//            doc: {
//               _id: "636e901bbc485bd111dd3880",
//               text: "first flair",
//               __v: 0
//             }
//         };
//         return resp;
//       };
//       subredditServiceObj.checkFlair=(subreddit,flairID) => {
//         const resp = {
//         success: false, error: subredditErrors.FLAIR_NOT_FOUND
//         };
        
//         return resp;
//       };
//       const result = await subredditServiceObj.updateFlair(subredditName);
//       expect(result.success).to.equal(false);
     
      
//     });
   
// });
// describe("check flair", () => {
  
//     it("first test success",  () => {
//         let subreddit = {
//             status: "success",
//             doc: {
//                 name: "first_one",
//                 flairIds: [
//                    "636e901bbc485bd111dd3880",
//                          "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c",
                       
//                 ]
//             }
//         }
//         const subredditServiceObj = new SubredditService( "", "","","");
//       const output = subredditServiceObj.checkFlair(subreddit,"636e901bbc485bd111dd3880");
//       assert.equal(output.status, "success");
      
//     });
//      it("first test fail ,flair not found",  () => {
//         let subreddit = {
//             status: "success",
//             doc: {
//                 name: "first_one",
//                 flairIds: [
//                    "636e901bbc485bd111dd3880",
//                          "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c",
                       
//                 ]
//             }
//         }
//         const subredditServiceObj = new SubredditService( "", "","","");
//       const output = subredditServiceObj.checkFlair(subreddit,"");
//       assert.equal(output.statusCode, 404);
      
//     });
//   });

// describe("check subreddit", () => {
  
//     it("first test success subreddit exists", async () => {
//       const RepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 name: "first subreddit",
//                 type:"Public",
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.checkSubreddit("");
//       assert.equal(output.status, "success");
      
//     });
//     it("2)no such subreddit", async () => {
//       const RepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"document not found"
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//         ""
//       );
//       const output = await subredditServiceObj.checkSubreddit("");
//       assert.equal(output.statusCode, 404);
      
//     });
   
// });
  
// describe("get flair", () => {
  
//     it("first test success", async () => {
//       const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {            
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//         };
        
//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 _id: "636e902bbc485bd111dd388c",
//                 text: "third flair",
//                 },
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","636e902bbc485bd111dd388c");
//       assert.equal(output.status, "success");
      
//     });
//     it("2)no such flair", async () => {
//     const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {            
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//         };
        
//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"cannot found document"
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","");
//       assert.equal(output.statusCode, 404);
      
//     });
//     it("3)no such subreddit", async () => {
//      const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//              const response = {
//                  status: "fail",
//                  statusCode: 404,
//                  err: "document not found"
//              };
          
//           return response;
//         },
//         };
        
//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"cannot found document"
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","636e902bbc485bd111dd388c");
//       assert.equal(output.statusCode, 404);
      
//     });
    
// });
  
// describe("delete flair", () => {
  
//     it("first test success", async () => {
//         const SubredditRepositoryObj = {
//             getOne: (userData, data) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"),
//                         flairIds: ["636e901bbc485bd111dd3880"],
//                     },
//                 };
//                 return response;
//             },
           
//             removeFromRefrenced: (data, dummy) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"),
//                         flairIds: [],
//                     },
//                 }
//                 return response;
//             }
            
//         }  
        
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.deleteFlair("firstSubreddit","636e901bbc485bd111dd3880",mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"));
//       assert.equal(output.status, "success");
      
//     });


//     it("second test failure not moderator", async () => {
//         const SubredditRepositoryObj = {
//             getOne: (userData, data) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8dbbf1721b2"),
//                         flairIds: ["636e901bbc485bd111dd3880"],
//                     },
//                 };
//                 return response;
//             },
           
//             removeFromRefrenced: (data, dummy) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8dbbf1721b2"),
//                         flairIds: [],
//                     },
//                 }
//                 return response;
//             }
            
//         }  
        
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.deleteFlair("firstSubreddit","636e901bbc485bd111dd3880",mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"));
//       assert.equal(output.statusCode, 403);
      
//     });
   
    
//   });

// describe("check flair", () => {

//     it("first test success",  () => {
//         let subreddit = {
//             status: "success",
//             doc: {
//                 name: "first_one",
//                 flairIds: [
//                    "636e901bbc485bd111dd3880",
//                          "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c",

//                 ]
//             }
//         }
//         const subredditServiceObj = new SubredditService( "", "","","");
//       const output = subredditServiceObj.checkFlair(subreddit,"636e901bbc485bd111dd3880");
//       assert.equal(output.status, "success");

//     });
//      it("first test fail ,flair not found",  () => {
//         let subreddit = {
//             status: "success",
//             doc: {
//                 name: "first_one",
//                 flairIds: [
//                    "636e901bbc485bd111dd3880",
//                          "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c",

//                 ]
//             }
//         }
//         const subredditServiceObj = new SubredditService( "", "","","");
//       const output = subredditServiceObj.checkFlair(subreddit,"");
//       assert.equal(output.statusCode, 404);

//     });
//   });

// describe("check subreddit", () => {

//     it("first test success subreddit exists", async () => {
//       const RepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 name: "first subreddit",
//                 type:"Public",
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.checkSubreddit("");
//       assert.equal(output.status, "success");

//     });
//     it("2)no such subreddit", async () => {
//       const RepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"document not found"
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//         ""
//       );
//       const output = await subredditServiceObj.checkSubreddit("");
//       assert.equal(output.statusCode, 404);

//     });

// });

// describe("get flair", () => {

//     it("first test success", async () => {
//       const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//         };

//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 _id: "636e902bbc485bd111dd388c",
//                 text: "third flair",
//                 },
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","636e902bbc485bd111dd388c");
//       assert.equal(output.status, "success");

//     });
//     it("2)no such flair", async () => {
//     const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//         };

//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"cannot found document"
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","");
//       assert.equal(output.statusCode, 404);

//     });
//     it("3)no such subreddit", async () => {
//      const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//              const response = {
//                  status: "fail",
//                  statusCode: 404,
//                  err: "document not found"
//              };

//           return response;
//         },
//         };

//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"cannot found document"
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","636e902bbc485bd111dd388c");
//       assert.equal(output.statusCode, 404);

//     });

// });

// describe("delete flair", () => {

//     it("first test success", async () => {
//         const SubredditRepositoryObj = {
//             getOne: (userData, data) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"),
//                         flairIds: ["636e901bbc485bd111dd3880"],
//                     },
//                 };
//                 return response;
//             },

//             removeFromRefrenced: (data, dummy) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"),
//                         flairIds: [],
//                     },
//                 }
//                 return response;
//             }

//         }

//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.deleteFlair("firstSubreddit","636e901bbc485bd111dd3880",mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"));
//       assert.equal(output.status, "success");

//     });

//     it("second test failure not moderator", async () => {
//         const SubredditRepositoryObj = {
//             getOne: (userData, data) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8dbbf1721b2"),
//                         flairIds: ["636e901bbc485bd111dd3880"],
//                     },
//                 };
//                 return response;
//             },

//             removeFromRefrenced: (data, dummy) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8dbbf1721b2"),
//                         flairIds: [],
//                     },
//                 }
//                 return response;
//             }

//         }

//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.deleteFlair("firstSubreddit","636e901bbc485bd111dd3880",mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"));
//       assert.equal(output.statusCode, 403);

//     });

//   });
