import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FieldValues, ReviewRequest, ReviewResponse } from "../../types";

import useReviewModal from "../../hooks/useReviewModal";

import Modal from "./Modal";
import Heading from "../Heading";

import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import Textarea from "../inputs/Textarea";
import RatingBar from "../RatingBar";
import reviewService from "../../services/reviewService";
import { Typography } from "@mui/material";
import { useAppSelector } from "../../app/reduxHooks";

interface ReviewModalProps {
  bookingId: number;
}

const ReviewModal = ({ bookingId }: ReviewModalProps) => {
  const reviewModal = useReviewModal();
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const [review, setReview] = useState<ReviewResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: '❗' });
      return;
    }

    const fetchReview = async () => {
      try {
        const reviews = await reviewService.getMyReviews();
        setReview(reviews.find(review => review.bookingId === bookingId));
      } catch (error: any) {
        console.error("Error fetching review:", error.response?.data);
        toast.error("Error: An error occurred while fetching the review.");
      }
    };

    fetchReview();
  }, [currentUser]);

  const defaultFormValues = {
    rating: null,
    review: ''
  };

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: defaultFormValues,
  });
  const ratingValue = watch("rating");
  const reviewValue = watch("review");

  if (!currentUser) {
    return <></>;
  }

  const onModalClose = () => {
    reset(defaultFormValues);
    reviewModal.onClose();
  }

  const onSubmit = async () => {
    const createReviewHandler = createServiceHandler(reviewService.createReview, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please try again.")}});

    const deleteReviewHandler = createServiceHandler(reviewService.deleteReview, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please try again.")}});

    if (review === undefined) {
      const reviewRequest: ReviewRequest = {
        bookingId,
        rating: ratingValue,
        review: reviewValue
      }
      const response = await createReviewHandler(reviewRequest);
      if (response.success && response.data) {
        toast.success("Review added");
        onModalClose();
        setReview(response.data);
      }
    } else {
      const response = await deleteReviewHandler(review.id);
      if (response.success) {
        toast.success("Review deleted");
        onModalClose();
        setReview(undefined);
      }
    }
  };

  let bodyContent;

  if (review === undefined) {
    bodyContent = (
      <div>
        <Heading
          title="Rate Your Tour Experience"
          subtitle="Share your thoughts and rate the tour you went on."
        />
        <RatingBar
          id="rating"
          label="Rating"
          readOnly={false}
          disabled={isLoading}
          precision={1}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
          required
        />
        <Textarea
          id="review"
          label="Review"
          minRows={3}
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    )
  } else {
    bodyContent = (
      <div>
        <RatingBar id={`review-${review.id}`} rating={review.rating} readOnly={true} />

        <Typography variant="body1">{review.review}</Typography>

        <Typography variant="caption">
          {`by ${review.userName} on ${new Date(review.createdDate).toLocaleDateString()}`}
        </Typography>
      </div>
    )
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={reviewModal.isOpen}
      title={review === undefined ? "Add Review" : "My Review"}
      actionLabel={review === undefined ? "Submit" : "Delete"}
      onClose={onModalClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default ReviewModal;
