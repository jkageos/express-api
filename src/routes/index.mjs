import { Router } from "express";
import authRouter from "./auth.mjs";
import blogsRouter from "./blogs.mjs";
import tagsRouter from "./tags.mjs";
import usersRouter from "./users.mjs";

const router = Router();

router.use(usersRouter);
router.use(authRouter);
router.use(tagsRouter);
router.use(blogsRouter);

export default router;
