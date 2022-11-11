const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
//process.env.NODE_ENV = "test";
const server = require("./../../server");

const app = require("./../../app");
const seeder = require("./../../models/flairAndPostseed");
const user1 = {
    email: "ahmedsabry@gmail.com",
    userName: "Ahmed",
    password: "12345678",
                       
};
const user2 = {
    userName: "khaled",
    email: "khaled@gmail.com",
    password: "12345678",
};


describe("get subreddit posts", async () => {
    describe("get hot posts", () => {
         
        it("first test success", (done) => {
        seeder().then(()=>{
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/subreddit/first_subreddit/hot") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.body.status, "success");
                       
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        })
        })
        it("2) test failure when no such subreddit", (done) => {
        
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/subreddit/secod_subreddit/hot") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.statusCode, 404);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        
        })
       
    });
    describe("get top posts", () => {
         
        it("first test success", (done) => {
        
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/subreddit/first_subreddit/top") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.body.status, "success");
                        
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        })
        
        it("2) test failure when no such subreddit", (done) => {
        
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/subreddit/secod_subreddit/top") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.statusCode, 404);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        
        })      
    });
     describe("get new posts", () => {
         
        it("first test success", (done) => {
       
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/subreddit/first_subreddit/new") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.body.status, "success");
                        
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        })
        
        it("2) test failure when no such subreddit", (done) => {
        
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/subreddit/secod_subreddit/new") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.statusCode, 404);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        
        })      
});
      

});



describe("get posts", async () => {
    describe("get hot posts", () => {
         
        it("first test success", (done) => {
       
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/users/hot") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.body.status, "success");
                       
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        })
        
      
       
    });
    describe("get top posts", () => {
         
        it("first test success", (done) => {
        
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/users/top") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.body.status, "success");
                        
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        })
        
         
    });
    describe("get new posts", () => {        
        it("first test success", (done) => {
        
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/users/new") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.body.status, "success");
                        
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        })
        
           
    });
    describe("get best posts", () => {        
        it("first test success", (done) => {
        
          request(app)
            .post("/api/v1/users/login")
            .send(user1)
            .then((res1) => {
                //console.log(res1);
                request(app)
                    .get("/api/v1/users/best") //ask about id?
                    .set("Cookie", res1.header["set-cookie"])
                    .send()
                    .then((res) => {
                        assert.equal(res.body.status, "success");
                        
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        })
        
           
});
      

});
