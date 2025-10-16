import { reviewRepository } from "../repositories/review.repository";
import { llmClient } from "../llm/client";
import template from "../prompts/summarize-reviews.txt";

export const reviewService = {
  async summarizeReviews(productId: number): Promise<string> {
    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }

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

    const summary = response.text;
    await reviewRepository.storeReviewSummary(productId, summary);

    return summary;
  },
};
