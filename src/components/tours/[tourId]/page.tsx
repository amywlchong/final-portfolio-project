import { useParams } from "react-router-dom";
import { Box, List, ListItem, Typography, Grid } from "@mui/material";
import { Timeline, TimelineItem, timelineItemClasses, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from "@mui/lab";
import tourService from "../../../services/tourService";
import { useEffect, useState } from "react";
import useScreenSize from "../../../hooks/useScreenSize";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RatingBar from "../../RatingBar";
import TourDatesFilter from "./TourDatesFilter";
import ImageCarousel from "../../ImageCarousel";
import { setCurrentTour } from "../../../redux/slices/tourSlice";
import { useAppDispatch, useAppSelector } from "../../../app/reduxHooks";
import { ApiError } from "../../../utils/ApiError";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ReviewResponse } from "../../../types";
import reviewService from "../../../services/reviewService";
import { dateToDateString } from "../../../utils/dataProcessing";

const TourPage = () => {
  const { id } = useParams<{ id: string }>();
  const tourId = Number(id);

  const { isSmallAndUp } = useScreenSize();
  const dispatch = useAppDispatch();
  const tour = useAppSelector(state => state.tours.currentTour);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [showReviews, setShowReviews] = useState(false);

  const handleShowReviews = async () => {
    if (!showReviews) {
      try {
        const fetchedReviews = await reviewService.getReviewsByTourId(tourId);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    setShowReviews(prev => !prev);
  };

  useEffect(() => {
    const fetchTour = async () => {
      const getTourHandler = createServiceHandler(tourService.getOneTour, {
        startLoading: () => setIsLoading(true),
        endLoading: () => setIsLoading(false),
      }, { handle: (error: ApiError) => setError(error) });

      const response = await getTourHandler(tourId);

      if (response.success) {
        dispatch(setCurrentTour(response.data || null));
        setError(null);
      }
    };

    fetchTour();
  }, [tourId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: An error occurred while fetching the tour.</div>;
  }

  if (!tour) {
    return <div>No tour found.</div>;
  }

  return (
    <Box>
      {tour.tourImages && tour.tourImages.length > 0 && (
        <ImageCarousel
          images={tour.tourImages}
          title={tour.name}
        />
      )}

      <Grid container
        direction={isSmallAndUp ? "row" : "column"}
        alignItems={isSmallAndUp ? "center" : "flex-start"}
        spacing={isSmallAndUp ? 2 : 0}
      >
        <Grid item>
          <Typography variant="h1" component="div">
            {tour.name}
          </Typography>
        </Grid>
        {tour.ratingsAverage && (
          <Grid item>
            <RatingBar id={`${tour.id}`} rating={tour.ratingsAverage} readOnly={true} />
          </Grid>
        )}
      </Grid>

      <Typography variant="subtitle1">
        Duration: {tour.duration} {tour.duration > 1 ? "days" : "day"} | Difficulty: {tour.difficulty} | Max Group Size: {tour.maxGroupSize}
      </Typography>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <LocationOnIcon style={{ marginRight: "8px" }} />
        <Typography variant="body1">
          {tour.region}
        </Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <MonetizationOnIcon style={{ marginRight: "8px" }} />
        <Typography variant="body1">
          {`$${tour.price} per person`}
        </Typography>
      </div>

      <Typography variant="h3" sx={{fontWeight: "bold" }} >
        {tour.summary}
      </Typography>
      <Typography variant="body1">
        {tour.description}
      </Typography>
      <Box mt={2} mb={2}>
        <Typography variant="body1">
          Start Address: {tour.startAddress}
        </Typography>
      </Box>

      {tour.tourPointsOfInterest && tour.tourPointsOfInterest.length > 0 &&
        <>
          <Typography variant="h2">
            Points of Interest:
          </Typography>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              marginTop: 0
            }}
          >
            {tour.tourPointsOfInterest?.map(poi => (
              <TimelineItem key={poi.id}>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h3" component="span">
                    {poi.pointOfInterest.name}
                  </Typography>
                  <Typography>{poi.pointOfInterest.description}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </>
      }

      {tour.tourStartDates && tour.tourStartDates.length > 0
        ? <TourDatesFilter />
        : <Typography variant="h3">Upcoming dates to be posted</Typography>
      }

      <Typography variant="body1" onClick={handleShowReviews} style={{ cursor: "pointer" }}>
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
                  {`${review.userName} on ${dateToDateString(new Date(review.createdDate))}`}
                </Typography>

              </ListItem>
            ))}
          </List>
          : <Typography variant="body1">No reviews yet</Typography>
      )}
    </Box>
  );
};

export default TourPage;
