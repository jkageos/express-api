import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../createApp.mjs";

describe("create user and login", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect(`${process.env.MONGO_DB_URI}/${process.env.MONGO_DB_NAME}?authSource=admin`)
      .then(() => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should create the user", async () => {
    const response = await request(app).post("/api/users").send({
      username: "adam",
      password: "password",
      email: "adam@email.com",
    });
    expect(response.statusCode).toBe(201);
  });

  it("should log the user in and visit /api/auth/status and return auth user", async () => {
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
