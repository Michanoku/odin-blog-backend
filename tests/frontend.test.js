import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Post and Comment Routes", () => {
  const user = {
    username: "routetest",
    email: "routetest@example.com",
    confirmation: "testpassword123",
    password: "testpassword123",
  };

  const otherUser = {
    username: "otherroutetest",
    email: "other@example.com",
    password: "testpassword123",
    confirmation: "testpassword123",
  };

  let token;
  let otherToken;
  let post;
  let comment;

  beforeAll(async () => {
    // Create test users
    await request(app).post("/user/register").send(user);
    await request(app).post("/user/register").send(otherUser);

    // Log in and save JWTs
    const loginResponse = await request(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });

    token = loginResponse.body.token;

    const otherLoginResponse = await request(app).post("/user/login").send({
      email: otherUser.email,
      password: otherUser.password,
    });

    otherToken = otherLoginResponse.body.token;

    // Get the test user's ID
    const testUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    // Create a test post
    post = await prisma.post.create({
      data: {
        title: "Test Post",
        body: "This is a test post.",
        published: true,
        userId: testUser.id,
        category: "test",
        slug: "testPost",
      },
    });

    // Create a comment belonging to the first user
    comment = await prisma.comment.create({
      data: {
        body: "This is a test comment.",
        userId: testUser.id,
        postId: post.id,
      },
    });
  });

  test("can read all posts without authentication", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((p) => p.id === post.id)).toBe(true);
  });

  test("can read a single post without authentication", async () => {
    const response = await request(app).get(`/posts/${post.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(post.id);
    expect(response.body.title).toBe(post.title);
  });

  test("authenticated user is available when reading a single post", async () => {
    const response = await request(app)
      .get(`/posts/${post.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(post.id);
    expect(response.body.title).toBe(post.title);
  });

  test("can read all comments without authentication", async () => {
    const response = await request(app).get(`/posts/${post.id}/comments`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("can read a single comment without authentication", async () => {
    const response = await request(app).get(
      `/posts/${post.id}/comments/${comment.id}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(comment.id);
  });

  test("authenticated user can create a comment", async () => {
    const response = await request(app)
      .post(`/posts/${post.id}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        commentBody: "Another test comment.",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.body).toBe("Another test comment.");
  });

  test("unauthenticated user cannot create a comment", async () => {
    const response = await request(app)
      .post(`/posts/${post.id}/comments`)
      .send({
        commentBody: "This should fail.",
      });

    expect(response.statusCode).toBe(401);
  });

  test("unauthenticated user cannot update a comment", async () => {
    const response = await request(app)
      .put(`/posts/${post.id}/comments/${comment.id}`)
      .send({
        commentBody: "This should fail.",
      });

    expect(response.statusCode).toBe(401);
  });

  test("unauthenticated user cannot delete a comment", async () => {
    const response = await request(app).delete(
      `/posts/${post.id}/comments/${comment.id}`,
    );

    expect(response.statusCode).toBe(401);
  });

  test("user cannot update another user's comment", async () => {
    const response = await request(app)
      .put(`/posts/${post.id}/comments/${comment.id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        commentBody: "This should not work.",
      });

    expect(response.statusCode).toBe(403);
  });

  test("user cannot delete another user's comment", async () => {
    const response = await request(app)
      .delete(`/posts/${post.id}/comments/${comment.id}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(response.statusCode).toBe(403);
  });

  test("user can update their own comment", async () => {
    const response = await request(app)
      .put(`/posts/${post.id}/comments/${comment.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        commentBody: "Updated test comment.",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(comment.id);
    expect(response.body.body).toBe("Updated test comment.");
  });

  test("user can delete their own comment", async () => {
    const response = await request(app)
      .delete(`/posts/${post.id}/comments/${comment.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
  });
});
