import type { Review } from "../generated/prisma";
import { reviewRepository } from "../repositories/review.repository";
import { llmClient } from "../llm/client";
import template from "../prompts/summarize-reviews.txt";

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    // get the last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join("\n\n");

    // send the reviews to a llm
    const prompt = template.replace("{{reviews}}", joinedReviews);

    const response = await llmClient.generateText({
      model: "gbt-4.1",
      prompt: prompt,
      temperature: 0.2,
      maxTokens: 500,
    });

    return response.text;
  },
};
