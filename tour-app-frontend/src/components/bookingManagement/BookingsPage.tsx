import { useEffect, useState } from "react";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../app/reduxHooks";
import { useBookings } from "../../hooks/data/useBookings";
import { useDateFilterModal } from "../../hooks/modals/useModals";
import { useAdminBookingModal } from "../../hooks/modals/useModals";
import { TableContainer, Paper, Typography, Box } from "@mui/material";
import { BookingResponse, Role } from "../../types";
import { canAccess } from "../../utils/accessControl";
import bookingService from "../../services/bookingService";
import Button from "../ui/Button";
import AdminBookingModal from "../modals/bookings/AdminBookingModal";
import BookingsTable from "./BookingsTable";

const BookingsPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const { isLoadingBookings, errorFetchingBookings, pastBookings, setPastBookings, futureBookings, setFutureBookings } = useBookings(bookingService.getAllBookings);
  const [bookingsToShow, setBookingsToShow] = useState<BookingResponse[]>([]);
  const [displayPastBookings, setDisplayPastBookings] = useState(false);

  const { setType: setDateFilterType } = useDateFilterModal();
  const adminBookingModal = useAdminBookingModal();

  useEffect(() => {
    setBookingsToShow(displayPastBookings ? pastBookings : futureBookings);
    setDateFilterType(displayPastBookings ? "past" : "future");
  }, [pastBookings, futureBookings, displayPastBookings]);

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  if (isLoadingBookings) {
    return <div>Loading...</div>;
  }

  if (errorFetchingBookings) {
    return <div>Error: An error occurred while fetching bookings.</div>;
  }

  const handleToggleClick = () => {
    setDisplayPastBookings(prev => !prev);
  };

  return (
    <div>
      <Box style={{ display: "flex", flexDirection: `${isSmallAndUp ? "row" : "column"}`, justifyContent: "space-between", alignItems: `${isSmallAndUp ? "center" : "flex-start"}` }}>
        <Typography variant="h1">Bookings</Typography>
        <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Button label={displayPastBookings ? "Future Bookings" : "Past Bookings"} onClick={handleToggleClick} sx={{ marginRight: 2 }} />
          {canAccess(currentUser.role, [Role.Admin]) && <Button label="New Booking" onClick={adminBookingModal.onOpen} />}
        </Box>
      </Box>

      <Box mt={2}>
        <Typography variant="h2">{displayPastBookings ? "Past Tours" : "Future Tours"}</Typography>
        <TableContainer component={Paper}>
          <BookingsTable
            currentUser={currentUser}
            bookings={bookingsToShow}
            setFutureBookings={setFutureBookings}
            setPastBookings={setPastBookings}
            enableEdit={!displayPastBookings}
          />
        </TableContainer>
      </Box>

      {canAccess(currentUser.role, [Role.Admin]) &&
        <AdminBookingModal
          setFutureBookings={setFutureBookings}
        />
      }
    </div>
  );
};

export default BookingsPage;
