import React from "react";
import { Tour } from "../../types";
import { Box, Typography } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  StyledLink,
  IrregularRectangle,
  OverlayText,
  StyledCard,
} from "../../styles";
import RatingBar from "../ui/RatingBar";
import { getSignedImageUrl } from "../../services/aws";

interface ListingCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: ListingCardProps) => {
  const coverImage = Array.isArray(tour.tourImages)
    ? tour.tourImages.find((image) => image.coverImage) || tour.tourImages[0]
    : undefined;

  const renderIconText = (
    icon: React.ReactNode,
    value: string | React.ReactElement
  ) => (
    <Typography
      component="div"
      style={{ display: "flex", alignItems: "center" }}
    >
      {icon}
      <Typography component="div" variant="body1" style={{ marginLeft: "8px" }}>
        {value}
      </Typography>
    </Typography>
  );

  return (
    <StyledLink to={`/tours/${tour.id}`}>
      <StyledCard>
        {tour.tourImages && tour.tourImages.length > 0 && (
          <>
            {coverImage && (
              <IrregularRectangle
                className="image-zoom"
                backgroundImageUrl={getSignedImageUrl(coverImage.imagePath)}
              />
            )}
            <OverlayText>{tour.name}</OverlayText>
          </>
        )}
        <Box ml={1}>
          {renderIconText(<HourglassEmptyIcon />, `${tour.duration}-day tour`)}
          {renderIconText(<LocationOnIcon />, tour.region)}
          {renderIconText(<MonetizationOnIcon />, `$${tour.price} per person`)}
          {tour.ratingsAverage &&
            renderIconText(
              <ThumbUpIcon />,
              <RatingBar
                id={`${tour.id}`}
                rating={tour.ratingsAverage}
                readOnly={true}
              />
            )}
        </Box>
      </StyledCard>
    </StyledLink>
  );
};

export default TourCard;
