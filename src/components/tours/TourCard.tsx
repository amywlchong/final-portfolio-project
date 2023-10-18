import { Tour } from "../../types";
import { StyledLink, IrregularRectangle, OverlayText, StyledCard } from "../../styles";
import RatingBar from "../RatingBar";

import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Typography } from "@mui/material";
import { getSignedImageUrl } from "../../services/aws";

interface ListingCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: ListingCardProps) => {

  return (
    <StyledLink to={`/tours/${tour.id}`}>
      <StyledCard>
        {
          tour.tourImages && tour.tourImages.length > 0 &&
          (() => {
            const coverImage = tour.tourImages.find(image => image.coverImage);
            if (coverImage) {
              return (
                <IrregularRectangle backgroundImageUrl={getSignedImageUrl(coverImage.imagePath)}>
                  <OverlayText>{tour.name}</OverlayText>
                </IrregularRectangle>
              );
            }
            return (
              <IrregularRectangle backgroundImageUrl={getSignedImageUrl(tour.tourImages[0].imagePath)}>
                <OverlayText>{tour.name}</OverlayText>
              </IrregularRectangle>
            );
          })()
        }
        <Box ml={1}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <HourglassEmptyIcon style={{ marginRight: '8px' }} />
            <Typography variant="body1">
              {`${tour.duration}-day tour`}
            </Typography>
          </div>
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
          {tour.ratingsAverage &&
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <ThumbUpIcon style={{ marginRight: '8px' }} />
              <RatingBar id={`${tour.id}`} rating={tour.ratingsAverage} readOnly={true} />
            </div>
          }
        </Box>
      </StyledCard>
    </StyledLink>
  );
}

export default TourCard;
