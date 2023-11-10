import { useState } from "react";
import { useParams } from "react-router-dom";
import { List, ListItem, Typography } from "@mui/material";
import { ReviewResponse } from "../../../types";
import { formatDateToYMDString } from "../../../utils/dataProcessing";
import reviewService from "../../../services/reviewService";
import RatingBar from "../../ui/RatingBar";

const Reviews = () => {
  const { id } = useParams<{ id: string }>();
  const tourId = Number(id);

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [showReviews, setShowReviews] = useState(false);

  const toggleReviews = async () => {
    if (!showReviews && reviews.length === 0) {
      try {
        const fetchedReviews = await reviewService.getReviewsByTourId(tourId);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    setShowReviews(prev => !prev);
  };

  return (
    <>
      <Typography variant="body1" onClick={toggleReviews} style={{ cursor: "pointer" }}>
        {showReviews ? "Hide Reviews" : "See Reviews"}
      </Typography>
      {showReviews && (
        reviews.length > 0
          ? <List>
            {reviews.map(review => (
              <ListItem key={review.id} style={{ flexDirection: "column", alignItems: "flex-start", padding: "16px" }}>

                <RatingBar id={`review-${review.id}`} rating={review.rating} readOnly={true} />

                <Typography variant="body1">{review.review}</Typography>

                <Typography variant="caption">
                  {`${review.userName} on ${formatDateToYMDString(new Date(review.createdDate))}`}
                </Typography>

              </ListItem>
            ))}
          </List>
          : <Typography variant="body1">No reviews yet</Typography>
      )}
    </>
  );
};

export default Reviews;
