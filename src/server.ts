import "dotenv/config";
import express from "express";
import prisma from "./lib/prisma";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import articleRoutes from "./routes/article.routes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Blog API is running!",
  });
});

app.get("/test-db", async (_req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

app.get("/test-auth", authenticate, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});