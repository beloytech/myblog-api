import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // if (!req.user) {
    //   return res.status(401).json({
    //     message: "Unauthorized",
    //   });
    // }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });

    return res.status(201).json({
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getArticles = async (
  req: Request,
  res: Response
) => {
  try {
    const { search, startDate, endDate, page, limit } = req.query;
    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 10;

    const skip = (currentPage - 1) * itemsPerPage;
    
    const articles = await prisma.article.findMany({
      where: {
  ...(search
    ? {
        OR: [
          {
            title: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: String(search),
              mode: "insensitive",
            },
          },
        ],
      }
    : {}),

  ...(startDate || endDate
    ? {
        createdAt: {
          ...(startDate
            ? {
                gte: new Date(String(startDate)),
              }
            : {}),
          ...(endDate
            ? {
                lt:new Date( 
                new Date(String(endDate)).getTime() + 
                24 * 60 * 60 * 1000,)
              }
            : {}),
        },
      }
    : {}),
      skip,
      take: itemsPerPage,

},
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      articles,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const articleId = Number(req.params.id);
    const { title, content } = req.body;

    if (Number.isNaN(articleId)) {
      return res.status(400).json({
        message: "Invalid article ID",
      });
    }

    // if (!req.user) {
    //   return res.status(401).json({
    //     message: "Unauthorized",
    //   });
    // }

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    if (article.authorId !== 1) {
      return res.status(403).json({
        message: "You are not allowed to update this article",
      });
    }

    const updatedArticle = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const articleId = Number(req.params.id);

    if (Number.isNaN(articleId)) {
      return res.status(400).json({
        message: "Invalid article ID",
      });
    }

    // if (!req.user) {
    //   return res.status(401).json({
    //     message: "Unauthorized",
    //   });
    // }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    if (article.authorId !== 1) {
      return res.status(403).json({
        message: "You are not allowed to delete this article",
      });
    }

    await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    return res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};