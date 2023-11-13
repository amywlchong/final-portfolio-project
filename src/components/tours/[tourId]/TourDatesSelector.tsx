import { useState, useEffect } from "react";
import { Range } from "react-date-range";
import useScreenSize from "../../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../../app/reduxHooks";
import { useBookingModal, useLoginModal } from "../../../hooks/modals/useModals";
import { Typography, List, ListItem, ListItemText, Grid, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Role, TourStartDate } from "../../../types";
import { addDays } from "date-fns";
import { formatDateAndTime } from "../../../utils/dataProcessing";
import { canAccess } from "../../../utils/accessControl";
import DatePicker from "../../inputs/DatePicker";
import BookingModal from "../../modals/bookings/BookingModal";
import Button from "../../ui/Button";
import toast from "react-hot-toast";

const TourDatesSelector = () => {
  const { is400AndUp, is500AndUp } = useScreenSize();
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const tour = useAppSelector(state => state.tours.currentTour);

  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: "selection"
  };
  const [range, setUserAvailabilityRange] = useState<Range>(initialDateRange);
  const [futureTourStartDates, setFutureTourStartDates] = useState<TourStartDate[]>([]);
  const [filteredTourStartDates, setFilteredTourStartDates] = useState<TourStartDate[]>([]);

  const datesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedStartDateTime, setSelectedStartDateTime] = useState<string | null>(null);
  const [availableSpacesOfSelected, setAvailableSpacesOfSelected] = useState(0);

  const bookingModal = useBookingModal();
  const loginModal = useLoginModal();

  useEffect(() => {
    const futureDates = tour?.tourStartDates?.filter(tsd => new Date(tsd.startDate.startDateTime) > new Date()) || [];
    setFutureTourStartDates(futureDates);
    setFilteredTourStartDates(futureDates);
  }, [tour]);

  if (!tour) {
    return <div>An error occurred.</div>;
  }

  if (futureTourStartDates.length === 0) {
    return <Typography variant="h3">Upcoming dates to be posted</Typography>;
  }

  const sortedTourStartDates = [...filteredTourStartDates].sort((a, b) => new Date(a.startDate.startDateTime).getTime() - new Date(b.startDate.startDateTime).getTime());

  const indexOfLastDate = currentPage * datesPerPage;
  const indexOfFirstDate = indexOfLastDate - datesPerPage;
  const currentDates = sortedTourStartDates.slice(indexOfFirstDate, indexOfLastDate);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filterDates = (dates: TourStartDate[], range: Range) => {
    return dates.filter(date => {
      const tourStartDate = new Date(date.startDate.startDateTime);
      const tourEndDate = addDays(tourStartDate, (tour.duration - 1));

      if (!range.startDate || !range.endDate) return true;

      // Set the user's end availability to the very end of the day
      const userEndDateEndOfDay = new Date(range.endDate);
      userEndDateEndOfDay.setHours(23, 59, 59, 999);

      return (
        tourStartDate >= range.startDate &&
        tourEndDate <= userEndDateEndOfDay
      );
    });
  };

  const onDatePickerChange = (range: Range) => {
    setUserAvailabilityRange(range);
    setFilteredTourStartDates(filterDates(tour?.tourStartDates || [], range));
  };

  const openBookingModal = () => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: "❗" });
      loginModal.onOpen();
    } else {
      bookingModal.onOpen();
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={6} lg={5}>
          <Typography variant="h2">
            Select Your Availability:
          </Typography>
          <Typography variant="body2">
            Tours starting and ending within the chosen dates will be shown.
          </Typography>
          <DatePicker
            onChange={(value) => onDatePickerChange(value.selection)}
            value={range}
            minDate={addDays(new Date(), 1)}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <div style={{ display: "flex", justifyContent: "space-between", width: is500AndUp ? "400px" : is400AndUp ? "350px" : "300px" }}>
            <Typography variant="h2">
              Start Dates:
            </Typography>
            <div style={{ display: "flex" }}>
              <IconButton
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                disabled={indexOfLastDate >= sortedTourStartDates.length}
                onClick={() => paginate(currentPage + 1)}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          </div>
          <List>
            {currentDates.map(date => (
              <ListItem
                key={date.id.startDateId}
                style={{
                  width: `${is500AndUp ? "380px" : is400AndUp ? "360px" : "300px" }`
                }}
              >
                <ListItemText
                  primary={formatDateAndTime(date.startDate.startDateTime)}
                  secondary={`Available Spaces: ${date.availableSpaces}`}
                />
                <Button
                  label="Book Now"
                  onClick={() => {
                    openBookingModal();
                    setSelectedStartDateTime(formatDateAndTime(date.startDate.startDateTime));
                    setAvailableSpacesOfSelected(date.availableSpaces || 0);
                  }}
                  disabled={
                    (currentUser?.role && !canAccess(currentUser?.role, [Role.Customer])) || !date.availableSpaces
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      {selectedStartDateTime &&
        <BookingModal
          startDateTime={selectedStartDateTime}
          availableSpaces={availableSpacesOfSelected}
        />
      }
    </div>
  );
};

export default TourDatesSelector;
