import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { StyledLink } from "../../styles";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../app/reduxHooks";
import { BookingResponse } from "../../types";
import {
  getBookingsThisMonth,
  getNumOfBookingsByProperty,
  numOfBookingsByProperty,
} from "../../utils/bookingsUtils";
import { ApiError } from "../../utils/ApiError";
import { getSignedImageUrl } from "../../services/aws";

interface TopToursProps {
  bookings: BookingResponse[];
  isLoading: boolean;
  error: ApiError | null;
}

const TopTours = ({ bookings, isLoading, error }: TopToursProps) => {
  const { isSmallAndUp } = useScreenSize();

  const tours = useAppSelector((state) => state.tours.allTours);

  const numOfBookingsByTourId: numOfBookingsByProperty<number>[] =
    getNumOfBookingsByProperty(
      getBookingsThisMonth(bookings),
      (booking) => booking.tourId
    );

  const threeMostBookedTours = numOfBookingsByTourId
    .sort((a, b) => b.numberOfBookings - a.numberOfBookings)
    .slice(0, 3)
    .map((numOfBookingsByTourId) => {
      return {
        numberOfBookings: numOfBookingsByTourId.numberOfBookings,
        tour: tours.find((tour) => tour.id === numOfBookingsByTourId.property),
      };
    });

  let topToursCardContent;
  if (isLoading) {
    topToursCardContent = <div>Loading...</div>;
  } else if (error) {
    topToursCardContent = <div>Error fetching data</div>;
  } else if (threeMostBookedTours.length > 0) {
    topToursCardContent = threeMostBookedTours.map((topTour, index) => {
      const coverImage =
        topTour.tour && Array.isArray(topTour.tour.tourImages)
          ? topTour.tour.tourImages.find((image) => image.coverImage) ||
            topTour.tour.tourImages[0]
          : undefined;
      return (
        <StyledLink
          to={`/tours/${topTour.tour?.id}`}
          key={index}
          sx={{
            width: isSmallAndUp ? "32%" : "90%",
            minHeight: "350px",
            marginTop: isSmallAndUp ? 0 : "10px",
          }}
        >
          <Card>
            {coverImage && (
              <CardMedia
                component="img"
                height="220px"
                image={getSignedImageUrl(coverImage.imagePath)}
                alt={topTour.tour?.name}
              />
            )}
            <CardContent>
              <Typography
                component="div"
                variant="body1"
                style={{ display: "flex", flexDirection: "column" }}
              >
                {topTour.tour?.name}
                <Chip
                  label={`${topTour.numberOfBookings} ${
                    topTour.numberOfBookings > 1 ? "bookings" : "booking"
                  }`}
                  variant="outlined"
                  color="primary"
                  style={{ maxWidth: "120px", marginTop: "10px" }}
                />
              </Typography>
            </CardContent>
          </Card>
        </StyledLink>
      );
    });
  } else {
    topToursCardContent = <div>No bookings found for this month.</div>;
  }

  return (
    <Card style={{ marginTop: "20px" }}>
      <CardHeader title="Best Selling Tours" subheader="This month" />
      <Box
        style={{
          display: "flex",
          flexDirection: isSmallAndUp ? "row" : "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {topToursCardContent}
      </Box>
    </Card>
  );
};

export default TopTours;
