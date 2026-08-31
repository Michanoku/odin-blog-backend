import request from "supertest";
import app from "../app.js";

describe("Authentication", () => {
  const user = {
    username: "testuser",
    email: "test@example.com",
    password: "testpassword123",
  };

  test("creates a new user", async () => {
    const response = await request(app)
      .post("/register")
      .send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(user.email);
    expect(response.body.username).toBe(user.username);
    expect(response.body).not.toHaveProperty("hash");
  });

  test("logs the user in and returns a JWT", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });
});