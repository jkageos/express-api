import { Router } from "express";
import { Comment } from "../mongoose/schemas/comment.mjs";

const router = Router();

// Fetch all comments
router.get("/api/comments", async (request, response) => {
  try {
    const comments = await Comment.find().populate('author', 'username').populate('blog', 'title');
    response.json(comments);
  } catch (error) {
    response.status(500).json({ message: "Error fetching comments", error: error.message });
  }
});

// Fetch a single comment by id
router.get("/api/comments/:id", async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id)
      .populate('author', 'username')
      .populate('blog', 'title')
      .populate('parentComment', 'content');
    if (!comment) {
      return response.status(404).json({ message: "Comment not found" });
    }
    response.json(comment);
  } catch (error) {
    response.status(500).json({ message: "Error fetching comment", error: error.message });
  }
});

// Create a comment
router.post("/api/comments", async (request, response) => {
  try {
    const newComment = new Comment(request.body);
    const savedComment = await newComment.save();
    response.status(201).json(savedComment);
  } catch (error) {
    response.status(400).json({ message: "Error creating comment", error: error.message });
  }
});

// Update a comment (only content and updatedAt)
router.patch("/api/comments/:id", async (request, response) => {
  try {
    const { content } = request.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      request.params.id,
      { 
        $set: { 
          content,
          updatedAt: Date.now()
        } 
      },
      { new: true, runValidators: true }
    );
    if (!updatedComment) {
      return response.status(404).json({ message: "Comment not found" });
    }
    response.json(updatedComment);
  } catch (error) {
    response.status(400).json({ message: "Error updating comment", error: error.message });
  }
});

// Delete a comment
router.delete("/api/comments/:id", async (request, response) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(request.params.id);
    if (!deletedComment) {
      return response.status(404).json({ message: "Comment not found" });
    }
    response.json({ message: "Comment deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: "Error deleting comment", error: error.message });
  }
});

export default router;
