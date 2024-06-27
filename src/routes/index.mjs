import { Router } from "express";
import authRouter from "./auth.mjs";
import blogsRouter from "./blogs.mjs";
import commentsRouter from "./comments.mjs";
import tagsRouter from "./tags.mjs";
import usersRouter from "./users.mjs";

const router = Router();

router.use(usersRouter);
router.use(authRouter);
router.use(tagsRouter);
router.use(blogsRouter);
router.use(commentsRouter);

export default router;
