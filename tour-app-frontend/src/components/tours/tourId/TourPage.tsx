import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/reduxHooks";
import { Box, Typography } from "@mui/material";

import { ApiError } from "../../../utils/ApiError";
import { createServiceHandler } from "../../../utils/serviceHandler";
import tourService from "../../../services/tourService";
import { setCurrentTour } from "../../../redux/slices/tourSlice";
import TourDatesSelector from "./TourDatesSelector";
import TourImages from "./TourImages";
import TourDetails from "./TourDetails";
import PointsOfInterest from "./PointsOfInterest";
import Reviews from "./Reviews";

const TourPage = () => {
  const { id } = useParams<{ id: string }>();
  const tourId = Number(id);

  const dispatch = useAppDispatch();
  const tour = useAppSelector((state) => state.tours.currentTour);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      const getTourHandler = createServiceHandler(
        tourService.getOneTour,
        {
          startLoading: () => setIsLoading(true),
          endLoading: () => setIsLoading(false),
        },
        { handle: (error: ApiError) => setError(error) }
      );

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
      <TourImages />
      <TourDetails />
      <PointsOfInterest />
      {tour.tourStartDates && tour.tourStartDates.length > 0 ? (
        <TourDatesSelector />
      ) : (
        <Typography variant="h3">Upcoming dates to be posted</Typography>
      )}
      <Reviews />
    </Box>
  );
};

export default TourPage;
