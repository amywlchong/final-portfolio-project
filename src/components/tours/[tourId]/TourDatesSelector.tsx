import { useState } from "react";
import useScreenSize from "../../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../../app/reduxHooks";
import { useBookingModal } from "../../../hooks/modals/useModals";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import { Range } from "react-date-range";
import { addDays } from "date-fns";
import { formatDateAndTime } from "../../../utils/dataProcessing";
import DatePicker from "../../inputs/DatePicker";
import BookingModal from "../../modals/bookings/BookingModal";
import Button from "../../ui/Button";

const TourDatesSelector = () => {
  const { is400AndUp, is500AndUp } = useScreenSize();
  const tour = useAppSelector(state => state.tours.currentTour);
  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: "selection"
  };
  const [userAvailability, setUserAvailability] = useState<Range>(initialDateRange);
  const [selectedStartDateTime, setSelectedStartDateTime] = useState<string | null>(null);
  const [availableSpacesOfSelected, setAvailableSpacesOfSelected] = useState(0);
  const bookingModal = useBookingModal();

  if (!tour) {
    return <div>An error occurred.</div>;
  }

  if (!tour.tourStartDates || tour.tourStartDates.length == 0) {
    return <Typography variant="h3">Upcoming dates to be posted</Typography>;
  }

  const filteredTourStartDates = tour.tourStartDates.filter(date => {
    const tourStartDate = new Date(date.startDate.startDateTime);
    const tourEndDate = addDays(tourStartDate, (tour.duration - 1));

    if (!userAvailability.startDate || !userAvailability.endDate) return true;

    // Set the user's end availability to the very end of the day
    const userEndDateEndOfDay = new Date(userAvailability.endDate);
    userEndDateEndOfDay.setHours(23, 59, 59, 999);

    return (
      tourStartDate >= userAvailability.startDate &&
      tourEndDate <= userEndDateEndOfDay
    );
  });

  return (
    <div>
      <Typography variant="h2">
        Select Your Availability:
      </Typography>
      <Typography variant="body2">
        Choose the dates you&apos;re available for the tour. Tours starting and ending within these dates will be shown.
      </Typography>
      <DatePicker
        onChange={(value) => setUserAvailability(value.selection)}
        value={userAvailability}
        minDate={addDays(new Date(), 1)}
      />

      <Typography variant="h3">
        Start Dates Within Your Availability:
      </Typography>
      <List>
        {filteredTourStartDates.map(date => (
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
                bookingModal.onOpen();
                setSelectedStartDateTime(formatDateAndTime(date.startDate.startDateTime));
                setAvailableSpacesOfSelected(date.availableSpaces || 0);
              }}
            />
          </ListItem>
        ))}
      </List>

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
