const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";
const seeder = require("./../../models/seed");

const app = require("./../../app");

describe("Comment controller test", () => {
  describe("Create comment", () => {
    it("create a post reply and a comment", async () => {
      await seeder();
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
        });
      expect(postRes.status).to.equal(201);

      postReply = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postRes._body.data._id,
          parentType: "Post",
          text: "Top level comment",
        });
      expect(postReply.status).to.equal(201);

      comment = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postReply._body.data._id,
          parentType: "Comment",
          text: "comment reply",
        });
      expect(comment.status).to.equal(201);
    });

    it("Invalid parent", async () => {
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
        });
      expect(postRes.status).to.equal(201);

      postReply = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postRes._body.data._id,
          parentType: "Comment",
          text: "Top level comment",
        });
      expect(postReply.status).to.equal(404);
    });

    it("Invalid req", async () => {
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
        });
      expect(postRes.status).to.equal(201);

      postReply = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postRes._body.data._id,
          text: "Top level comment",
        });
      expect(postReply.status).to.equal(400);
    });
  });

  describe("Delete comment", () => {
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
        });
      expect(postRes.status).to.equal(201);

      postReply = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postRes._body.data._id,
          parentType: "Post",
          text: "Top level comment",
        });
      expect(postReply.status).to.equal(201);

      deleteRes = await request(app)
        .delete(`/api/v1/comments/${postReply._body.data._id}`)
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

      deleteRes = await request(app)
        .delete(`/api/v1/comments/636d490f3ff67d626ec990cb`)
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
        });
      expect(postRes.status).to.equal(201);

      postReply = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postRes._body.data._id,
          parentType: "Post",
          text: "Top level comment",
        });
      expect(postReply.status).to.equal(201);

      res = await request(app).post("/api/v1/users/login").send({
        userName: "khaled",
        email: "khaled@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      deleteRes = await request(app)
        .delete(`/api/v1/comments/${postReply._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(deleteRes.status).to.equal(401);
    });
  });

  describe("Update comment", () => {
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

      comment = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postRes._body.data._id,
          parentType: "Post",
          text: "Top level comment",
        });
      expect(comment.status).to.equal(201);

      updateRes = await request(app)
        .patch(`/api/v1/comments/${comment._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send({ text: "Updated comment text" });
      expect(updateRes.status).to.equal(200);
      expect(updateRes._body.data.text).to.equal("Updated comment text");
    });

    it("Update: non valid id", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      updateRes = await request(app)
        .patch(`/api/v1/comments/636d490f3ff67d626ec990cb`)
        .set("Cookie", res.header["set-cookie"])
        .send({ text: "some text" });
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

      comment = await request(app)
        .post("/api/v1/comments")
        .set("Cookie", res.header["set-cookie"])
        .send({
          parent: postRes._body.data._id,
          parentType: "Post",
          text: "Top level comment",
        });
      expect(comment.status).to.equal(201);

      res = await request(app).post("/api/v1/users/login").send({
        userName: "khaled",
        email: "khaled@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      updateRes = await request(app)
        .patch(`/api/v1/comments/${comment._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send({ text: "some text" });
      expect(updateRes.status).to.equal(401);
    });
  });
});
