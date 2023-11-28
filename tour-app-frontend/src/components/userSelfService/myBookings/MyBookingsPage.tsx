import { useState } from "react";
import useScreenSize from "../../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../../app/reduxHooks";
import { useBookings } from "../../../hooks/data/useBookings";
import { Typography, Box } from "@mui/material";
import bookingService from "../../../services/bookingService";
import Button from "../../ui/Button";
import ReviewModal from "../../modals/reviews/ReviewModal";
import BookingCard from "./BookingCard";

const BookingsPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const currentUser = useAppSelector((state) => state.user.loggedInUser);

  const {
    isLoadingBookings,
    errorFetchingBookings,
    pastBookings,
    futureBookings,
    setFutureBookings,
  } = useBookings(bookingService.getMyBookings);
  const [displayPastBookings, setDisplayPastBookings] = useState(false);

  const [bookingIdOfReview, setBookingIdOfReview] = useState<number | null>(
    null
  );

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  if (isLoadingBookings) {
    return <div>Loading...</div>;
  }

  if (errorFetchingBookings) {
    return <div>Error: An error occurred while fetching bookings.</div>;
  }

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          flexDirection: `${isSmallAndUp ? "row" : "column"}`,
          justifyContent: "space-between",
          alignItems: `${isSmallAndUp ? "center" : "flex-start"}`,
        }}
      >
        <Typography variant="h1">My Bookings</Typography>
        <Button
          label={displayPastBookings ? "Future Bookings" : "Past Bookings"}
          onClick={() => setDisplayPastBookings((prev) => !prev)}
        />
      </Box>

      {!displayPastBookings && (
        <Box mt={2}>
          <Typography variant="h2">Future Tours</Typography>
          {futureBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              enableEdit={true}
              enableReviewButton={false}
              setFutureBookings={setFutureBookings}
              setBookingIdOfReview={setBookingIdOfReview}
            />
          ))}
        </Box>
      )}

      {displayPastBookings && (
        <Box mt={2}>
          <Typography variant="h2">Past Tours</Typography>
          {pastBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              enableEdit={false}
              enableReviewButton={true}
              setFutureBookings={setFutureBookings}
              setBookingIdOfReview={setBookingIdOfReview}
            />
          ))}
        </Box>
      )}

      {bookingIdOfReview && <ReviewModal bookingId={bookingIdOfReview} />}
    </Box>
  );
};

export default BookingsPage;
