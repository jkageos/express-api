import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../createApp.mjs";
import { User } from "../mongoose/schemas/user.mjs";

describe("create user and login", () => {
  let app;
  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.MONGO_DB_NAME}?authSource=admin`);
    console.log("Connected to Test Database");
    app = createApp();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should create the user", async () => {
    const response = await request(app).post("/api/users").send({
      username: "adam",
      password: "password",
      email: "adam@email.com",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe("adam");
    expect(response.body.email).toBe("adam@email.com");
  });

  it("should not create a user with an existing username", async () => {
    await User.create({ username: "adam", password: "password", email: "adam@email.com" });
    const response = await request(app).post("/api/users").send({
      username: "adam",
      password: "newpassword",
      email: "newadam@email.com",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Username or email already exists");
  });

  it("should log the user in and visit /api/auth/status and return auth user", async () => {
    await User.create({ username: "adam", password: "password", email: "adam@email.com" });
    
    const loginResponse = await request(app)
      .post("/api/auth")
      .send({ username: "adam", password: "password" });

    expect(loginResponse.statusCode).toBe(200);
    
    const cookies = loginResponse.headers['set-cookie'];
    
    const statusResponse = await request(app)
      .get("/api/auth/status")
      .set("Cookie", cookies);

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.username).toBe("adam");
    expect(statusResponse.body.email).toBe("adam@email.com");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
