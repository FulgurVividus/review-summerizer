import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import StarRating from "./StarRating";
import { Button } from "../ui/button";
import { HiSparkles } from "react-icons/hi2";
import { useState } from "react";
import ReviewSkeleton from "./ReviewSkeleton";

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

type SummarizeResponse = {
  summary: string;
};

const ReviewList = ({ productId }: Props) => {
  const [summary, setSummary] = useState<string>("");
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string>("");

  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery<GetReviewsResponse>({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(),
  });

  const handleSummarize = async () => {
    try {
      setIsSummaryLoading(true);
      setSummaryError("");

      const { data } = await axios.post<SummarizeResponse>(
        `/api/products/${productId}/reviews/summarize`
      );

      setSummary(data.summary);
    } catch (error: any) {
      console.error(error.message);
      setSummaryError("Could not summarize the reviews :( Try again!");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  async function fetchReviews() {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    return data;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500">Couldn't fetch the review. Try again!</p>
    );
  }

  if (!reviewData?.reviews.length) {
    return null;
  }

  const currentSummary: string | null = reviewData.summary || summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              type="button"
              onClick={handleSummarize}
              className="cursor-pointer"
              disabled={isSummaryLoading}
            >
              <HiSparkles /> Summarize
            </Button>
            {isSummaryLoading && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryError && <p className="text-red-500">{summaryError}</p>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {reviewData?.reviews.map((review) => (
          <div key={review.id}>
            <div className="font-semibold">{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <p className="py-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
