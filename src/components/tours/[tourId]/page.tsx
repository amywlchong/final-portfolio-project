import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import tourService from '../../../services/tourService';
import { useEffect, useState } from 'react';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RatingBar from '../../RatingBar';
import TourDatesFilter from './TourDatesFilter';
import ImageCarousel from '../../ImageCarousel';
import { setCurrentTour } from '../../../redux/slices/tourSlice';
import { useAppDispatch, useAppSelector } from '../../../app/reduxHooks';
import { ApiError } from '../../../utils/ApiError';
import { createServiceHandler } from '../../../utils/serviceHandler';
import { ReviewResponse } from '../../../types';
import reviewService from '../../../services/reviewService';

const TourPage = () => {
  const { id } = useParams<{ id: string }>();
  const tourId = Number(id);

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
        console.error('Error fetching reviews:', error);
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
    <Card>
      {tour.tourImages && tour.tourImages.length > 0 && (
        <ImageCarousel
          images={tour.tourImages}
          title={tour.name}
        />
      )}
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h1" component="div" style={{ marginRight: '16px' }}>
            {tour.name}
          </Typography>
          {tour.ratingsAverage &&
            <RatingBar id={`${tour.id}`} rating={tour.ratingsAverage} readOnly={true} />
          }
        </div>

        <Typography variant="subtitle1">
          Duration: {tour.duration} {tour.duration > 1 ? 'days' : 'day'} | Difficulty: {tour.difficulty} | Max Group Size: {tour.maxGroupSize}
        </Typography>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <LocationOnIcon style={{ marginRight: '8px' }} />
          <Typography variant="body1">
            {tour.region}
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <MonetizationOnIcon style={{ marginRight: '8px' }} />
          <Typography variant="body1">
            {`$${tour.price} per person`}
          </Typography>
        </div>

        <Typography variant="body1" sx={{fontWeight: 'bold'}} >
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
            <List>
              {tour.tourPointsOfInterest?.map(poi => (
                <ListItem key={poi.id}>
                  <ListItemText
                    primary={poi.pointOfInterest.name}
                    secondary={poi.pointOfInterest.description}
                  />
                </ListItem>
              ))}
            </List>
          </>
        }

        {tour.tourStartDates && tour.tourStartDates.length > 0
          ? <TourDatesFilter />
          : <Typography variant="h3">Upcoming dates to be posted</Typography>
        }

        <>
          <Typography variant="body1" onClick={handleShowReviews} style={{ cursor: 'pointer' }}>
            {showReviews ? "Hide Reviews" : "See Reviews"}
          </Typography>
          {showReviews && (
            reviews.length > 0
            ? <List>
                {reviews.map(review => (
                  <ListItem key={review.id} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>

                      <RatingBar id={`review-${review.id}`} rating={review.rating} readOnly={true} />

                      <Typography variant="body1">{review.review}</Typography>

                      <Typography variant="caption">
                        {`by ${review.userName} on ${new Date(review.createdDate).toLocaleDateString()}`}
                      </Typography>

                  </ListItem>
                ))}
              </List>
            : <Typography variant="body1">No reviews yet</Typography>
          )}
        </>
      </CardContent>
    </Card>
  );
}

export default TourPage;
