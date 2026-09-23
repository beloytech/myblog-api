import { Router } from "express";
import {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller";
// import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getArticles);

router.post("/", createArticle);

router.put("/:id", updateArticle);

router.delete("/:id", deleteArticle);

export default router;