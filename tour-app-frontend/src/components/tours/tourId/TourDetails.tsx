import useScreenSize from "../../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../../app/reduxHooks";
import { Box, Typography, Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import RatingBar from "../../ui/RatingBar";

const TourDetails = () => {
  const { isSmallAndUp } = useScreenSize();
  const tour = useAppSelector((state) => state.tours.currentTour);

  if (!tour) {
    return <div>No tour found.</div>;
  }

  return (
    <>
      <Grid
        container
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
            <RatingBar
              id={`${tour.id}`}
              rating={tour.ratingsAverage}
              readOnly={true}
            />
          </Grid>
        )}
      </Grid>

      <Typography variant="subtitle1">
        Duration: {tour.duration} {tour.duration > 1 ? "days" : "day"} |
        Difficulty: {tour.difficulty} | Max Group Size: {tour.maxGroupSize}
      </Typography>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <LocationOnIcon style={{ marginRight: "8px" }} />
        <Typography variant="body1">{tour.region}</Typography>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <MonetizationOnIcon style={{ marginRight: "8px" }} />
        <Typography variant="body1">{`$${tour.price} per person`}</Typography>
      </div>

      <Typography variant="h3" sx={{ fontWeight: "bold" }}>
        {tour.summary}
      </Typography>
      <Typography variant="body1">{tour.description}</Typography>
      <Box mt={2} mb={2}>
        <Typography variant="body1">
          Start Address: {tour.startAddress}
        </Typography>
      </Box>
    </>
  );
};

export default TourDetails;
