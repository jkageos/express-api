import * as validator from "express-validator";
import * as helpers from "../utils/helpers.mjs";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { User } from "../mongoose/schemas/user.mjs";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "Invalid Field" }]),
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    email: "test@email.com",
  })),
}));

jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock("../mongoose/schemas/user.mjs", () => ({
  User: {
    findById: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  },
}));

describe("get users", () => {
  it("should get user by id", async () => {
    const mockUser = {
      _id: "123",
      username: "test",
      email: "test@email.com",
    };
    User.findById.mockResolvedValue(mockUser);

    const mockRequest = {
      params: { id: "123" },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getUserByIdHandler(mockRequest, mockResponse);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
  });

  it("should return 404 when user not found", async () => {
    User.findById.mockResolvedValue(null);

    const mockRequest = {
      params: { id: "456" },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getUserByIdHandler(mockRequest, mockResponse);

    expect(User.findById).toHaveBeenCalledWith("456");
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "User not found" });
  });
});

describe("create users", () => {
  it("should return status of 400 when there are validation errors", async () => {
    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createUserHandler(mockRequest, mockResponse);

    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
  });

  it("should return status of 201 and the user created", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const mockSavedUser = {
      _id: "789",
      username: "test",
      email: "test@email.com",
      toObject: jest.fn().mockReturnValue({
        _id: "789",
        username: "test",
        email: "test@email.com",
        password: "hashed_password",
      }),
    };

    User.prototype.save.mockResolvedValue(mockSavedUser);

    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createUserHandler(mockRequest, mockResponse);

    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    expect(User.prototype.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      _id: "789",
      username: "test",
      email: "test@email.com",
    });
  });

  it("should return status of 400 when username or email already exists", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    User.prototype.save.mockRejectedValue({ code: 11000 });

    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createUserHandler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "Username or email already exists" });
  });

  it("should return status of 500 when there's a server error", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    User.prototype.save.mockRejectedValue(new Error("Server error"));

    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createUserHandler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "Server error" });
  });
});
