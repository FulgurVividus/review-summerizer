import OpenAI from "openai";
import type { Review } from "../generated/prisma";
import { reviewRepository } from "../repositories/review.repository";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    // get the last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join("\n\n");

    // send the reviews to a llm
    const prompt = `Summarize the following customer reviews into a short paragraph highlighting key themes, both positive and negative:
    ${joinedReviews}
    `;

    const response = await client.responses.create({
      model: "gbt-4.1",
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 500,
    });
    const summary = response.output_text;

    return summary;
  },
};
