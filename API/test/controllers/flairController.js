// const assert = require("chai").assert;
// const expect = require("chai").expect;
// const request = require("supertest");

// const dotenv = require("dotenv");
// dotenv.config({ path: "config/config.env" });
// //process.env.NODE_ENV = "test";
// const server = require("./../../server");

// const app = require("./../../app");
// const seeder = require("./../../models/flairAndPostseed");
// const user1 = {
//     email: "ahmedsabry@gmail.com",
//     userName: "Ahmed",
//     password: "12345678",

// };
// const user2 = {
//     userName: "khaled",
//     email: "khaled@gmail.com",
//     password: "12345678",
// };
// let flairId;

// describe("Subreddit Controller Test", async () => {
//     describe("Create Flair Test", () => {

//         it("first test success", (done) => {
//         seeder().then(()=>{
//           request(app)
//             .post("/api/v1/users/login")
//             .send(user1)
//             .then((res1) => {
//                 //console.log(res1);
//                 request(app)
//                     .post("/api/v1/subreddit/first_subreddit/flair") //ask about id?
//                     .set("Cookie", res1.header["set-cookie"])
//                     .send({
//                         text:"first subreddit first flair",
//                     })
//                     .then((res) => {
//                         assert.equal(res.body.status, "success");
//                         flairId = res.body.data._id;
//                         done();
//                     })
//                     .catch((err) => {
//                         done(err);
//                     });
//             });
//         })
//         })
//         it("2) test failure when not moderator", (done) => {

//           request(app)
//             .post("/api/v1/users/login")
//             .send(user1)
//             .then((res1) => {
//                 //console.log(res1);
//                 request(app)
//                     .post("/api/v1/subreddit/second_subreddit/flair") //ask about id?
//                     .set("Cookie", res1.header["set-cookie"])
//                     .send({
//                         text:"first subreddit first flair",
//                     })
//                     .then((res) => {
//                         assert.equal(res.statusCode, 403);
//                         done();
//                     })
//                     .catch((err) => {
//                         done(err);
//                     });
//             });

//         })
//         it("3) test failure when no such subreddit", (done) => {

//           request(app)
//             .post("/api/v1/users/login")
//             .send(user1)
//             .then((res1) => {
//                 //console.log(res1);
//                 request(app)
//                     .post("/api/v1/subreddit/first2_subreddit/flair") //ask about id?
//                     .set("Cookie", res1.header["set-cookie"])
//                     .send({
//                         text:"first subreddit first flair",
//                     })
//                     .then((res) => {
//                         assert.equal(res.statusCode, 404);
//                         done();
//                     })
//                     .catch((err) => {
//                         done(err);
//                     });
//             });

//  })
// });

//     // describe("update flair test", () => {
//     //     it("first test success", (done) => {
//     //         request(app)
//     //             .post("/api/v1/users/login")
//     //             .send({
//     //                 email: "ahmedsabry@gmail.com",
//     //                 userName: "Ahmed",
//     //                 password: "12345678",

//     //             })
//     //             .then((res1) => {
//     //                 //console.log(res1);
//     //                 request(app)
//     //                     .patch("/api/v1/subreddit/mysubreddit/flair/636d77b0d707951224c0b5b9") //ask about id?
//     //                     .set("Cookie", res1.header["set-cookie"])
//     //                     .send({
//     //                        permissions:"modOnly",
//     //                     })
//     //                     .then((res) => {
//     //                         //console.log(res);
//     //                         assert.equal(res.body.status, "success");
//     //                         console.log("Passed from first test in create subreddit");
//     //                         done();
//     //                     })
//     //                     .catch((err) => {
//     //                         done(err);
//     //                     });
//     //             });

//     //     })
//     // });
//     describe("get all Flairs", () => {
//         it("1) test success", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .get("/api/v1/subreddit/first_subreddit/flair") //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send()
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.body.status, "success");
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("f2) test success not existing subreddit", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .get("/api/v1/subreddit/first_sureddit/flair") //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send()
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 404);

//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//     });

//     describe("get a flair", () => {
//         it("1) test success", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .get(`/api/v1/subreddit/first_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send()
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.body.status, "success");
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("2) test failure not existing subreddit", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .get(`/api/v1/subreddit/firsst_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send()
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 404);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("3) test failure not existing flair", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .get(`/api/v1/subreddit/first_subreddit/flair/636db46a20000f0860238101`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send()
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 404);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//     });

//     describe("update a flair", () => {
//         it("1) test success", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .patch(`/api/v1/subreddit/first_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send({
//                             permissions:"allowEdit",
//                         })
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.body.status, "success");
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("2) test failure not existing subreddit", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .patch(`/api/v1/subreddit/firsst_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send({
//                             permissions:"allowEdit",
//                         })
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 404);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("3) test failure not existing flair", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .patch(`/api/v1/subreddit/first_subreddit/flair/636db46a20000f0860238101`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send({
//                             permissions:"allowEdit",
//                         })
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 404);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("4) test failure not moderator", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user2)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .patch(`/api/v1/subreddit/first_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send({
//                             permissions:"allowEdit",
//                         })
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 403);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//     });

//     describe("delete a flair", () => {
//         it("1) test success", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .delete(`/api/v1/subreddit/first_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send()
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.body.status, "success");
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });
//         })
//         it("2) test failure not existing subreddit", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .delete(`/api/v1/subreddit/firsst_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send({
//                             permissions:"allowEdit",
//                         })
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 404);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("3) test failure not existing flair", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user1)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .delete(`/api/v1/subreddit/first_subreddit/flair/636db46a20000f0860238101`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send({
//                             permissions:"allowEdit",
//                         })
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 404);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//         it("4) test failure not moderator", (done) => {
//             request(app)
//                 .post("/api/v1/users/login")
//                 .send(user2)
//                 .then((res1) => {
//                     //console.log(res1);
//                     request(app)
//                         .delete(`/api/v1/subreddit/first_subreddit/flair/${flairId}`) //ask about id?
//                         .set("Cookie", res1.header["set-cookie"])
//                         .send({
//                             permissions:"allowEdit",
//                         })
//                         .then((res) => {
//                             //console.log(res);
//                             assert.equal(res.status, 403);
//                             done();
//                         })
//                         .catch((err) => {
//                             done(err);
//                         });
//                 });

//         })
//     });

// });
