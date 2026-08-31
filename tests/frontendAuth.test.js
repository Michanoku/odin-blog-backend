import request from "supertest";
import app from "../app.js";

describe("Post and Comment Routes", () => {
  const user = {
    username: "routetest",
    email: "routetest@example.com",
    password: "testpassword123",
  };

  let token;

  beforeAll(async () => {
    // Create test user
    await request(app).post("/register").send(user);

    // Log in and save JWT
    const response = await request(app).post("/login").send({
      email: user.email,
      password: user.password,
    });

    token = response.body.token;
  });

  test("can read all posts without authentication", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toBe(200);
    expect(response.body.action).toBe("readallposts");
  });

  test("can read a single post without authentication", async () => {
    const response = await request(app).get("/posts/12");

    expect(response.statusCode).toBe(200);
    expect(response.body.postId).toBe("12");
    expect(response.body.action).toBe("readsinglepost");
  });

  test("authenticated user is available when reading a single post", async () => {
    const response = await request(app)
      .get("/posts/12")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.postId).toBe("12");
  });

  test("can read all comments without authentication", async () => {
    const response = await request(app).get("/posts/12/comments");

    expect(response.statusCode).toBe(200);
    expect(response.body.postId).toBe("12");
    expect(response.body.action).toBe("readallcomments");
  });

  test("can read a single comment without authentication", async () => {
    const response = await request(app).get("/posts/12/comments/34");

    expect(response.statusCode).toBe(200);
    expect(response.body.postId).toBe("12");
    expect(response.body.commentId).toBe("34");
    expect(response.body.action).toBe("readsinglecomment");
  });

  test("authenticated user can create a comment", async () => {
    const response = await request(app)
      .post("/posts/12/comments")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.postId).toBe("12");
    expect(response.body.action).toBe("createcomment");
  });

  test("unauthenticated user cannot create a comment", async () => {
    const response = await request(app).post("/posts/12/comments");

    expect(response.statusCode).toBe(401);
  });

  test("unauthenticated user cannot update a comment", async () => {
    const response = await request(app).put("/posts/12/comments/34");

    expect(response.statusCode).toBe(401);
  });

  test("unauthenticated user cannot delete a comment", async () => {
    const response = await request(app).delete("/posts/12/comments/34");

    expect(response.statusCode).toBe(401);
  });
});
