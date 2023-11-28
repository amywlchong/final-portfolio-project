import { useState } from "react";
import useScreenSize from "../../../hooks/ui/useScreenSize";
import { useReviewModal } from "../../../hooks/modals/useModals";
import { Link } from "react-router-dom";
import { Typography, Box, Select, Card, CardContent, CardActions, IconButton, Collapse, MenuItem, Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BiSolidSave } from "react-icons/bi";
import { BookingRequest, BookingResponse } from "../../../types";
import { formatDateToYMDString, formatDateAndTime, calculateEndDateFromDuration } from "../../../utils/dataProcessing";
import { ApiError } from "../../../utils/ApiError";
import { createServiceHandler } from "../../../utils/serviceHandler";
import bookingService from "../../../services/bookingService";
import tourService from "../../../services/tourService";
import Button from "../../ui/Button";
import LabeledText from "../../ui/LabeledText";
import toast from "react-hot-toast";

interface BookingCardProps {
  booking: BookingResponse;
  enableEdit: boolean;
  enableReviewButton: boolean;
  setFutureBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
  setBookingIdOfReview: React.Dispatch<React.SetStateAction<number | null>>;
}

const BookingCard = ({ booking, enableEdit, enableReviewButton, setFutureBookings, setBookingIdOfReview }: BookingCardProps) => {
  const { isSmallAndUp } = useScreenSize();

  const [expandedBookings, setExpandedBookings] = useState<number[]>([]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [availableStartDates, setAvailableStartDates] = useState<string[]>([]);
  const [newStartDate, setNewStartDate] = useState<string>("");

  const reviewModal = useReviewModal();

  const isExpanded = (bookingId: number): boolean => {
    return expandedBookings.includes(bookingId);
  };

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

  return (
    <Card style={{ margin: "20px 0", padding: "0 30px" }}>
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
            {`${formatDateToYMDString(new Date(booking.startDateTime))} - ${formatDateToYMDString(calculateEndDateFromDuration(new Date(booking.startDateTime), booking.tourDuration))}`}
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
  );
};

export default BookingCard;
