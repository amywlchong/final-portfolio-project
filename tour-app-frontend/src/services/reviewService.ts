import axios from "axios";

import { apiBaseUrl } from "../config/constants";
import { ReviewRequest, ReviewResponse } from "../types";
import { getAuthHeader } from "./authHeader";

const getMyReviews = async () => {
  const authHeader = getAuthHeader();
  const { data } = await axios.get<ReviewResponse[]>(
    `${apiBaseUrl}/me/reviews`,
    authHeader
  );
  return data;
};

const getReviewsByTourId = async (tourId: number) => {
  const { data } = await axios.get<ReviewResponse[]>(
    `${apiBaseUrl}/tours/${tourId}/reviews`
  );
  return data;
};

const createReview = async (reviewRequest: ReviewRequest) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.post<ReviewResponse>(
    `${apiBaseUrl}/reviews`,
    reviewRequest,
    authHeader
  );
  return data;
};

const deleteReview = async (reviewId: number) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.delete<ReviewResponse>(
    `${apiBaseUrl}/reviews/${reviewId}`,
    authHeader
  );
  return data;
};

export default { getMyReviews, getReviewsByTourId, createReview, deleteReview };
