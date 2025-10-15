import type { Review } from "../generated/prisma";
import { reviewRepository } from "../repositories/review.repository";

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    // get the last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join("\n\n");

    // send the reviews to a llm
    const summary = "This is a placeholder summary";
    return summary;
  },
};
