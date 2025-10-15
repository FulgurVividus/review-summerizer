import { Router } from "express";
import type { Request, Response } from "express";
import { chatController } from "./controllers/chat.controller";
import { PrismaClient } from "./generated/prisma";

const router = Router();

router.post("/api/chat", chatController.sendMessage);

router.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const productId: number = Number(req.params.id);

  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
});

export default router;
