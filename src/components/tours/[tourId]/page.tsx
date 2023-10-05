import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, List, ListItem, ListItemText, Typography } from '@mui/material';
import tourService from '../../../services/tourService';
import { useEffect, useState } from 'react';
import { Tour } from '../../../types';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RatingBar from '../../RatingBar';
import TourDatesFilter from './TourDatesFilter';
import ImageCarousel from '../../ImageCarousel';

const TourPage = () => {
  const { id } = useParams<{ id: string }>();
  const tourId = Number(id);

  const [tour, setTour] = useState<Tour | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      try {
        const fetchedTour = await tourService.getOneTour(tourId);
        setTour(fetchedTour);
        setError(null);
      } catch (error: any) {
        setError('An error occurred while fetching the tour.');
        console.error("Error:", error?.response?.data || "An unknown error occurred while fetching the tour.");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
            <RatingBar rating={tour.ratingsAverage} readOnly={true} />
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
            {`$${tour.price.toString()} per person`}
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
          ? <TourDatesFilter tourStartDates={tour.tourStartDates} tourDuration={tour.duration} />
          : <Typography variant="h3">Upcoming dates to be posted</Typography>
        }
      </CardContent>
    </Card>
  );
}

export default TourPage;
