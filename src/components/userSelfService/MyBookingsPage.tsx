import { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography, Box, Select, Card, CardContent, CardActions, IconButton, Collapse, MenuItem, Grid } from "@mui/material";
import LabeledText from "../LabeledText";
import useScreenSize from "../../hooks/useScreenSize";
import { BookingRequest, BookingResponse } from "../../types";
import { dateToDateString, formatDateAndTime, getEndDate } from "../../utils/dataProcessing";
import bookingService from "../../services/bookingService";
import toast from "react-hot-toast";
import { useAppSelector } from "../../app/reduxHooks";
import Button from "../Button";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import useReviewModal from "../../hooks/useReviewModal";
import ReviewModal from "../modals/ReviewModal";
import tourService from "../../services/tourService";
import { BiSolidSave } from "react-icons/bi";
import { Link } from "react-router-dom";

const BookingsPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [errorFetchingBookings, setErrorFetchingBookings] = useState<ApiError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [displayPastBookings, setDisplayPastBookings] = useState(false);
  const [pastBookings, setPastBookings] = useState<BookingResponse[]>([]);
  const [futureBookings, setFutureBookings] = useState<BookingResponse[]>([]);

  const [expandedBookings, setExpandedBookings] = useState<number[]>([]);

  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [availableStartDates, setAvailableStartDates] = useState<string[]>([]);
  const [newStartDate, setNewStartDate] = useState<string>("");

  const [bookingIdOfReview, setBookingIdOfReview] = useState<number | null>(null);
  const reviewModal = useReviewModal();

  useEffect(() => {
    const fetchBookings = async () => {
      const getMyBookingsHandler = createServiceHandler(bookingService.getMyBookings, {
        startLoading: () => setIsLoadingBookings(true),
        endLoading: () => setIsLoadingBookings(false),
      }, { handle: (error: ApiError) => setErrorFetchingBookings(error) });

      const response = await getMyBookingsHandler();

      if (response.success && response.data) {
        const futureBookings = response.data.filter(booking => new Date(booking.startDateTime).getTime() >= new Date().getTime());
        const pastBookings = response.data.filter(booking => new Date(booking.startDateTime).getTime() < new Date().getTime());
        setPastBookings(pastBookings.sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()));
        setFutureBookings(futureBookings.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()));
        setErrorFetchingBookings(null);
      }
    };

    fetchBookings();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  if (isLoadingBookings) {
    return <div>Loading...</div>;
  }

  if (errorFetchingBookings) {
    return <div>Error: An error occurred while fetching bookings.</div>;
  }

  const handleExpandClick = (bookingId: number): void => {
    setExpandedBookings(prevState => {
      const isCurrentlyExpanded = prevState.includes(bookingId);

      if (isCurrentlyExpanded) {
        return prevState.filter(id => id !== bookingId);
      } else {
        return [...prevState, bookingId];
      }
    });
  };

  const isExpanded = (bookingId: number): boolean => {
    return expandedBookings.includes(bookingId);
  };

  const handleEditClick = async (booking: BookingResponse): Promise<void> => {
    try {
      const tourDetails = await tourService.getOneTour(booking.tourId);
      if (!tourDetails) {
        throw new Error("Error fetching tour details.");
      }

      const tourStartDates = tourDetails.tourStartDates;
      const filteredStartDates = tourStartDates
        ? tourStartDates
          .filter(tourStartDate =>
            tourStartDate.availableSpaces &&
            tourStartDate.availableSpaces > 0 &&
            new Date(tourStartDate.startDate.startDateTime).getTime() > new Date().setHours(23, 59, 59, 999)
          )
          .map(tourStartDate => tourStartDate.startDate.startDateTime)
        : [];

      setAvailableStartDates(filteredStartDates);
      setEditingBookingId(booking.id);
      setNewStartDate(booking.startDateTime);
    } catch (error: any) {
      console.error("Error fetching available start dates:", error.response?.data);
    }
  };

  const updateBookingHandler = createServiceHandler(bookingService.updateBooking, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred while updating the booking. Please try again.");}});

  const handleSaveDateChange = async (bookingId: number, existingBooking: BookingResponse): Promise<void> => {
    const updatedBooking: BookingRequest = {
      userId: existingBooking.userId,
      tourId: existingBooking.tourId,
      startDateTime: newStartDate,
      numberOfParticipants: existingBooking.numberOfParticipants
    };

    const response = await updateBookingHandler(bookingId, updatedBooking);

    if (response.success && response.data) {
      setFutureBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, startDateTime: newStartDate } : b)
      );
      toast.success("Booking updated.");
      setEditingBookingId(null);
      setNewStartDate("");
    }
  };

  const renderCards = (
    bookings: BookingResponse[],
    enableEdit = false,
    enableReviewButton = false
  ) => (
    bookings.map((booking) => (
      <Card key={booking.id} style={{ margin: "20px 0", padding: "0 30px" }}>
        <CardContent>
          <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h3">
              <Link to={`/tours/${booking.tourId}`}>{booking.tourName}</Link>
            </Typography>
            {isSmallAndUp && <Typography variant="body1">Booking ID: {booking.id}</Typography>}
          </Box>
          <Typography component='div' style={{ display: "flex", alignItems: "center" }}>
            <LocationOnIcon style={{ marginRight: "8px" }} />
            <Typography variant="body1">
              {booking.tourRegion}
            </Typography>
          </Typography>
          <Typography component='div' style={{ display: "flex", alignItems: "center" }}>
            <HourglassEmptyIcon style={{ marginRight: "8px" }} />
            <Typography variant="body1">
              {`${dateToDateString(new Date(booking.startDateTime))} - ${dateToDateString(getEndDate(new Date(booking.startDateTime), booking.tourDuration))}`}
            </Typography>
          </Typography>
          {!isSmallAndUp && <Typography variant="body1">Booking ID: {booking.id}</Typography>}
        </CardContent>
        <CardActions style={{ padding: "8px 16px 16px 16px", display: "flex", alignItems: "center"}}>
          <Grid container spacing={2}>
            <Grid item xs={10} sm={11} md={6}>
              <Button
                label="Review"
                onClick={() => {
                  setBookingIdOfReview(booking.id);
                  reviewModal.onOpen();
                }}
                disabled={!enableReviewButton}
              />
            </Grid>
            <Grid item xs={2} sm={1} md={6}>
              <IconButton
                onClick={() => {
                  handleExpandClick(booking.id);
                }}
                aria-expanded={isExpanded(booking.id)}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardActions>
        <Collapse in={isExpanded(booking.id)} timeout="auto" unmountOnExit>
          <CardContent>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" component="span" style={{ whiteSpace: "pre-wrap", marginRight: "5px" }}>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Start Date & Time:
                </Box>
              </Typography>
              {editingBookingId === booking.id ? (
                <>
                  <Select
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value as string)}
                  >
                    {availableStartDates.map(date => (
                      <MenuItem key={date} value={date}>
                        {formatDateAndTime(date)}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    label="Save"
                    onClick={() => handleSaveDateChange(booking.id, booking)}
                    icon={BiSolidSave}
                    disabled={isUpdating}
                  />
                </>
              ) : (
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <Typography>{formatDateAndTime(booking.startDateTime)}</Typography>
                  {enableEdit &&
                    <IconButton
                      onClick={() => handleEditClick(booking)}
                      style={{ margin: "0 10px", padding: 0 }}
                    >
                      <EditIcon />
                    </IconButton>
                  }
                </Box>
              )}
            </Box>
            <LabeledText label="Participants" value={`${booking.numberOfParticipants} ${booking.numberOfParticipants > 1 ? "people" : "person"}`} />
            <LabeledText label="Unit Price" value={`$${booking.unitPrice}`} />
            <LabeledText label="Total Price" value={`$${booking.totalPrice}`} />
            <LabeledText label="Paid" value={booking.paid ? "Yes" : "No"} />
          </CardContent>
        </Collapse>
      </Card>
    ))
  );

  return (
    <Box>
      <Box style={{ display: "flex", flexDirection: `${isSmallAndUp ? "row" : "column"}`, justifyContent: "space-between", alignItems: `${isSmallAndUp ? "center" : "flex-start"}` }}>
        <Typography variant="h1">My Bookings</Typography>
        <Button
          label={displayPastBookings ? "Future Bookings" : "Past Bookings"}
          onClick={() => setDisplayPastBookings(prev => !prev)}
        />
      </Box>

      {!displayPastBookings && (
        <Box mt={2}>
          <Typography variant="h2">Future Tours</Typography>
          {renderCards(futureBookings, true, false)}
        </Box>
      )}

      {displayPastBookings && (
        <Box mt={2}>
          <Typography variant="h2">Past Tours</Typography>
          {renderCards(pastBookings, false, true)}
        </Box>
      )}

      {bookingIdOfReview && <ReviewModal bookingId={bookingIdOfReview} />}
    </Box>
  );
};

export default BookingsPage;
