const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";
const server = require("./../../server");
const seeder = require("./../../models/seed");

const app = require("./../../app");

describe("Post controller test", () => {
  describe("Create post Test", () => {
    it("successful post creation", async () => {
      await seeder();
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      res = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(res.status).to.equal(201);
    });

    it("unsuccessful post creation", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      res = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "Subreddit",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(res.status).to.equal(400);
    });
  });

  describe("Delete post Test", () => {
    it("successful deletion", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      deleteRes = await request(app)
        .delete(`/api/v1/posts/${postRes._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(deleteRes.status).to.equal(204);
    });

    it("delete: non valid id", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      deleteRes = await request(app)
        .delete(`/api/v1/posts/636d490f3ff67d626ec990cb`)
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(deleteRes.status).to.equal(404);
    });

    it("delete: unauthorized", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      res = await request(app).post("/api/v1/users/login").send({
        userName: "khaled",
        email: "khaled@gmail.com",
        password: "12345678"
      });
      expect(res.status).to.equal(200);

      deleteRes = await request(app)
      .delete(`/api/v1/posts/${postRes._body.data._id}`)
      .set("Cookie", res.header["set-cookie"])
      .send();
    expect(deleteRes.status).to.equal(401);
    });
  });
  
  describe("Update post Test", () => {
    it("successful update", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      updateRes = await request(app)
        .patch(`/api/v1/posts/${postRes._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send({text: "some text"});
      expect(updateRes.status).to.equal(200);
      expect(updateRes._body.data.text).to.equal('some text');
    });

    it("Update: non valid id", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      updateRes = await request(app)
        .patch(`/api/v1/posts/636d490f3ff67d626ec990cb`)
        .set("Cookie", res.header["set-cookie"])
        .send({text: "some text"});
      expect(updateRes.status).to.equal(404);
    });

    it("update: unauthorized", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      res = await request(app).post("/api/v1/users/login").send({
        userName: "khaled",
        email: "khaled@gmail.com",
        password: "12345678"
      });
      expect(res.status).to.equal(200);

      updateRes = await request(app)
      .patch(`/api/v1/posts/${postRes._body.data._id}`)
      .set("Cookie", res.header["set-cookie"])
      .send({text: "some text"});
      expect(updateRes.status).to.equal(401);
    });
  });
});
