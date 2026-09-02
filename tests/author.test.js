import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Author Post Routes", () => {
  const userA = {
    username: "Rick",
    email: "rick@centralfinitecurve.com",
    confirmation: "wubbalubbadubbdubb",
    password: "wubbalubbadubbdubb",
  };

  const userB = {
    username: "Morty",
    email: "morty@b00bworld.com",
    confirmation: "ohgeezohwowohgeez",
    password: "ohgeezohwowohgeez",
  };

  const userC = {
    username: "Jerry",
    email: "jerry@lovefinderrz.com",
    confirmation: "imthekingoftheworld",
    password: "imthekingoftheworld",
  };

  let tokenA;
  let tokenB;
  let tokenC;

  let postA;
  let postB;

  beforeAll(async () => {
    // Create users
    await request(app).post("/user/register").send(userA);
    await request(app).post("/user/register").send(userB);
    await request(app).post("/user/register").send(userC);

    // Log in all users
    const loginA = await request(app).post("/user/login").send({
      email: userA.email,
      password: userA.password,
    });

    const loginB = await request(app).post("/user/login").send({
      email: userB.email,
      password: userB.password,
    });

    const loginC = await request(app).post("/user/login").send({
      email: userC.email,
      password: userC.password,
    });

    // Save the tokens
    tokenA = loginA.body.token;
    tokenB = loginB.body.token;
    tokenC = loginC.body.token;

    // Give users A and B author status
    await request(app)
      .put("/user/authorStatus/true")
      .set("Authorization", `Bearer ${tokenA}`);

    await request(app)
      .put("/user/authorStatus/true")
      .set("Authorization", `Bearer ${tokenB}`);
  });

  describe("GET /posts", () => {
    test("author can read all of their own posts", async () => {
      // Create a post for user A
      const createResponse = await request(app)
        .post("/author/posts")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          postTitle: "We need more crystals!",
          postBody:
            "Morty if you read this get into the garage, we need to go get more crystals Morty.",
          published: false,
        });

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body).toHaveProperty("id");

      postA = createResponse.body;

      const response = await request(app)
        .get("/author/posts")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((post) => post.id === postA.id)).toBe(true);
    });

    test("another author can read their own posts", async () => {
      // Create a post for user B
      const createResponse = await request(app)
        .post("/author/posts")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          postTitle: "Stop busting into my room!",
          postBody: "Someday you're gonna see something!",
          published: false,
        });

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body).toHaveProperty("id");

      postB = createResponse.body;

      const response = await request(app)
        .get("/author/posts")
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((post) => post.id === postB.id)).toBe(true);
    });

    test("non-author user cannot access all posts", async () => {
      const response = await request(app)
        .get("/author/posts")
        .set("Authorization", `Bearer ${tokenC}`);

      expect(response.statusCode).toBe(403);
    });

    test("unauthenticated user cannot access all posts", async () => {
      const response = await request(app).get("/author/posts");

      expect(response.statusCode).toBe(401);
    });
  });

  describe("POST /posts", () => {
    test("author can create a post", async () => {
      // Create another post for user A
      const response = await request(app)
        .post("/author/posts")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          postTitle: "Who ate the alien virus in the fridge?",
          postBody:
            "To whoever ate the alien virus I put in the fridge, unless you want your insides to come outside, come to the garage to confess.",
          published: false,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(
        "Who ate the alien virus in the fridge?",
      );
    });

    test("non-author user cannot create a post", async () => {
      const response = await request(app)
        .post("/author/posts")
        .set("Authorization", `Bearer ${tokenC}`)
        .send({
          postTitle: "This is my house!",
          postBody: "Stop putting alien viruses in the fridge!",
          published: false,
        });

      expect(response.statusCode).toBe(403);
    });

    test("unauthenticated user cannot create a post", async () => {
      const response = await request(app).post("/author/posts").send({
        postTitle: "This is GearHead!",
        postBody: "Are you interested in my newsletter about the gear wars?",
        published: false,
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /posts/:postId", () => {
    test("post owner can read their own post", async () => {
      const response = await request(app)
        .get(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(postA.id);
    });

    test("another author cannot read someone else's post", async () => {
      const response = await request(app)
        .get(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.statusCode).toBe(403);
    });

    test("non-author user cannot read a post", async () => {
      const response = await request(app)
        .get(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenC}`);

      expect(response.statusCode).toBe(403);
    });

    test("unauthenticated user cannot read an author post", async () => {
      const response = await request(app).get(`/author/posts/${postA.id}`);

      expect(response.statusCode).toBe(401);
    });
  });
  describe("PUT /posts/:postId", () => {
    test("post owner can update their own post", async () => {
      const response = await request(app)
        .put(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          postTitle: "That should be enough crystals...",
          postBody:
            "I'm over the crystals Morty, seriously, I found something way better!",
          published: false,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(postA.id);
      expect(response.body.title).toBe("That should be enough crystals...");
    });

    test("another author cannot update someone else's post", async () => {
      const response = await request(app)
        .put(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          postTitle: "I hacked Rick!",
          postBody: "Who's evil Morty now?",
          published: false,
        });

      expect(response.statusCode).toBe(403);
    });

    test("non-author user cannot update a post", async () => {
      const response = await request(app)
        .put(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenC}`)
        .send({
          postTitle: "Jerry is the best!",
          postBody: "I love Jerry, everyone loves Jerry. I just had to say it.",
          published: false,
        });

      expect(response.statusCode).toBe(403);
    });

    test("unauthenticated user cannot update a post", async () => {
      const response = await request(app)
        .put(`/author/posts/${postA.id}`)
        .send({
          postTitle: "Gear Wars Update 242",
          postBody: "Follow the link to enlarge your gears!",
          published: false,
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("DELETE /posts/:postId", () => {
    test("another author cannot delete someone else's post", async () => {
      const response = await request(app)
        .delete(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.statusCode).toBe(403);
    });

    test("non-author user cannot delete a post", async () => {
      const response = await request(app)
        .delete(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenC}`);

      expect(response.statusCode).toBe(403);
    });

    test("unauthenticated user cannot delete a post", async () => {
      const response = await request(app).delete(`/author/posts/${postA.id}`);

      expect(response.statusCode).toBe(401);
    });

    test("post owner can delete their own post", async () => {
      const response = await request(app)
        .delete(`/author/posts/${postA.id}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.statusCode).toBe(204);

      // Make sure it is actually gone
      const deletedPost = await prisma.post.findUnique({
        where: { id: postA.id },
      });

      expect(deletedPost).toBeNull();
    });
  });
});
