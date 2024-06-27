import { Router } from "express";
import { Tag } from "../mongoose/schemas/tag.mjs";

const router = Router();

// Fetch all tags
router.get("/api/tags", async (request, response) => {
  try {
    const tags = await Tag.find();
    response.json(tags);
  } catch (error) {
    response.status(500).json({ message: "Error fetching tags", error: error.message });
  }
});

// Fetch a single tag by id
router.get("/api/tags/:id", async (request, response) => {
  try {
    const tag = await Tag.findById(request.params.id);
    if (!tag) {
      return response.status(404).json({ message: "Tag not found" });
    }
    response.json(tag);
  } catch (error) {
    response.status(500).json({ message: "Error fetching tag", error: error.message });
  }
});

// Create a tag
router.post("/api/tags", async (request, response) => {
  try {
    const newTag = new Tag(request.body);
    const savedTag = await newTag.save();
    response.status(201).json(savedTag);
  } catch (error) {
    response.status(400).json({ message: "Error creating tag", error: error.message });
  }
});

// Update a tag
router.put("/api/tags/:id", async (request, response) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!updatedTag) {
      return response.status(404).json({ message: "Tag not found" });
    }
    response.json(updatedTag);
  } catch (error) {
    response.status(400).json({ message: "Error updating tag", error: error.message });
  }
});

// Delete a tag
router.delete("/api/tags/:id", async (request, response) => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(request.params.id);
    if (!deletedTag) {
      return response.status(404).json({ message: "Tag not found" });
    }
    response.json({ message: "Tag deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: "Error deleting tag", error: error.message });
  }
});

export default router;
