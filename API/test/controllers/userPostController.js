const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";
const seeder = require("./../../models/seed");

const app = require("./../../app");

describe("Post Controller (user posts) Test", () => {
  describe("user posts Test", () => {
    it("first test success", (done) => {
      seeder().then(() => {
        request(app)
          .post("/api/v1/users/login")
          .send({
            email: "ahmedsabry@gmail.com",
            userName: "Ahmed",
            password: "12345678",
          })
          .then((res1) => {
            //console.log(res1.body);

            //console.log(res1.header);
            request(app)
              .get("/api/v1/users/Ahmed/posts")
              .set("Cookie", res1.header["set-cookie"])
              .send()
              .then((res) => {
                console.log(res.body);
                done();
              })
              .catch(err);
            {
              console.log("err");
              done();
            }
            //done();
          });
      });
    });
  });
});
