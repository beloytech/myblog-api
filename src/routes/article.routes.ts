import { Router } from "express";
import {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getArticles);

router.post("/", authenticate, createArticle);

router.put("/:id", authenticate, updateArticle);

router.delete("/:id", authenticate, deleteArticle);

export default router;