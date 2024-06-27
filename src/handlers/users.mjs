import { matchedData, validationResult } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

export const getUserByIdHandler = async (request, response) => {
  try {
    const user = await User.findById(request.params.id).select('-password');
    if (!user) return response.status(404).send({ message: "User not found" });
    return response.send(user);
  } catch (error) {
    return response.status(500).send({ message: "Server error" });
  }
};

export const createUserHandler = async (request, response) => {
  const result = validationResult(request);
  if (!result.isEmpty()) return response.status(400).send(result.array());
  
  const data = matchedData(request);
  data.password = hashPassword(data.password);
  
  try {
    const newUser = new User(data);
    const savedUser = await newUser.save();
    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;
    return response.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err.code === 11000) {
      return response.status(400).send({ message: "Username or email already exists" });
    }
    return response.status(500).send({ message: "Server error" });
  }
};
