import request from "supertest";
import app from "../app.js";

describe("Authentication", () => {
  const user = {
    username: "Jean-Michael Vincent",
    email: "jmv@twobrothers.com",
    confirmation: "interdimensional",
    password: "interdimensional",
  };

  test("creates a new user", async () => {
    const response = await request(app).post("/user/register").send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(user.email);
    expect(response.body.username).toBe(user.username);
    expect(response.body).not.toHaveProperty("hash");
  });

  test("logs the user in and returns a JWT", async () => {
    const response = await request(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  test("updates the user's username", async () => {
    const loginResponse = await request(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .put("/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "HughJackman",
        "current-password": user.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.username).toBe("HughJackman");
    expect(response.body.email).toBe(user.email);
    expect(response.body).not.toHaveProperty("hash");
  });

  test("updates the user's email", async () => {
    const loginResponse = await request(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .put("/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "hugh@twobrothers.com",
        "current-password": user.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("hugh@twobrothers.com");
    expect(response.body.username).toBe("HughJackman");
    expect(response.body).not.toHaveProperty("hash");
  });

  test("updates the user's password", async () => {
    const loginResponse = await request(app).post("/user/login").send({
      email: "hugh@twobrothers.com",
      password: user.password,
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .put("/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "imgoingtotakeahugeackman",
        confirmation: "imgoingtotakeahugeackman",
        "current-password": user.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("hash");

    // Make sure the new password actually works.
    const newLoginResponse = await request(app).post("/user/login").send({
      email: "hugh@twobrothers.com",
      password: "imgoingtotakeahugeackman",
    });

    expect(newLoginResponse.statusCode).toBe(200);
    expect(newLoginResponse.body).toHaveProperty("token");
  });

  test("rejects an update with an incorrect current password", async () => {
    const loginResponse = await request(app).post("/user/login").send({
      email: "hugh@twobrothers.com",
      password: "imgoingtotakeahugeackman",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .put("/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "GearHead",
        "current-password": "wrongpassword123",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
