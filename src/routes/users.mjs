import { Router } from "express";
import {
	query,
	validationResult,
	checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

const router = Router();

router.get(
	"/api/users",
	query("filter")
		.isString()
		.notEmpty()
		.withMessage("Must not be empty")
		.isLength({ min: 3, max: 10 })
		.withMessage("Must be at least 3-10 characters"),
	async (request, response) => {
		const result = validationResult(request);
		if (!result.isEmpty()) {
			return response.status(400).json({ errors: result.array() });
		}

		const { filter, value } = request.query;
		try {
			let users;
			if (filter && value) {
				users = await User.find({ [filter]: { $regex: value, $options: 'i' } }).select('-password');
			} else {
				users = await User.find().select('-password');
			}
			return response.json(users);
		} catch (error) {
			return response.status(500).json({ message: "Server error" });
		}
	}
);

router.get("/api/users/:id", getUserByIdHandler);

router.post(
	"/api/users",
	checkSchema(createUserValidationSchema),
	createUserHandler
);

router.put("/api/users/:id", async (request, response) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			request.params.id,
			request.body,
			{ new: true, runValidators: true }
		).select('-password');
		if (!updatedUser) {
			return response.status(404).json({ message: "User not found" });
		}
		return response.json(updatedUser);
	} catch (error) {
		return response.status(400).json({ message: error.message });
	}
});

router.patch("/api/users/:id", async (request, response) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			request.params.id,
			{ $set: request.body },
			{ new: true, runValidators: true }
		).select('-password');
		if (!updatedUser) {
			return response.status(404).json({ message: "User not found" });
		}
		return response.json(updatedUser);
	} catch (error) {
		return response.status(400).json({ message: error.message });
	}
});

router.delete("/api/users/:id", async (request, response) => {
	try {
		const deletedUser = await User.findByIdAndDelete(request.params.id);
		if (!deletedUser) {
			return response.status(404).json({ message: "User not found" });
		}
		return response.json({ message: "User deleted successfully" });
	} catch (error) {
		return response.status(500).json({ message: "Server error" });
	}
});

export default router;
