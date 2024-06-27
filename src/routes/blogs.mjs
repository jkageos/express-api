import { Router } from "express";
import { Blog } from "../mongoose/schemas/blog.mjs";

const router = Router();

// Fetch all blogs
router.get("/api/blogs", async (request, response) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    response.json(blogs);
  } catch (error) {
    response.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
});

// Fetch a single blog by id
router.get("/api/blogs/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('author', 'username');
    if (!blog) {
      return response.status(404).json({ message: "Blog not found" });
    }
    response.json(blog);
  } catch (error) {
    response.status(500).json({ message: "Error fetching blog", error: error.message });
  }
});

// Create a blog
router.post("/api/blogs", async (request, response) => {
  try {
    const newBlog = new Blog(request.body);
    const savedBlog = await newBlog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ message: "Error creating blog", error: error.message });
  }
});

// Update all values of a blog
router.put("/api/blogs/:id", async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!updatedBlog) {
      return response.status(404).json({ message: "Blog not found" });
    }
    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ message: "Error updating blog", error: error.message });
  }
});

// Update a variable amount of values of a blog
router.patch("/api/blogs/:id", async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { $set: request.body }, { new: true, runValidators: true });
    if (!updatedBlog) {
      return response.status(404).json({ message: "Blog not found" });
    }
    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ message: "Error updating blog", error: error.message });
  }
});

export default router;
