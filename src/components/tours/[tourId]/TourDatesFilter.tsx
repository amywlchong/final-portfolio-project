import { useState } from 'react';
import { Range } from 'react-date-range';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import { addDays } from 'date-fns';
import DatePicker from '../../inputs/DatePicker';
import BookingModal from '../../modals/BookingModal';
import Button from '../../Button';
import { useAppSelector } from '../../../app/reduxHooks';
import { formatDateAndTime } from '../../../utils/dataProcessing';

const TourDatesFilter = () => {
  const tour = useAppSelector(state => state.tours.currentTour);
  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: 'selection'
  };
  const [userAvailability, setUserAvailability] = useState<Range>(initialDateRange);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedStartDateTime, setSelectedStartDateTime] = useState<string | null>(null);
  const [availableSpacesOfSelected, setAvailableSpacesOfSelected] = useState(0);

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
    const userEndOfDay = new Date(userAvailability.endDate);
    userEndOfDay.setHours(23, 59, 59, 999);

    return (
      tourStartDate.getTime() >= userAvailability.startDate.getTime() &&
      tourEndDate.getTime() <= userEndOfDay.getTime()
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
      />

      <Typography variant="h3">
        Start Dates Within Your Availability:
      </Typography>
      <List>
        {filteredTourStartDates.map(date => (
          <ListItem
            key={date.id.startDateId}
            style={{
              width: '360px'
            }}
          >
            <ListItemText
              primary={formatDateAndTime(date.startDate.startDateTime)}
              secondary={`Available Spaces: ${date.availableSpaces}`}
            />
            <Button
              label="Book Now"
              onClick={() => {
                setIsBookingModalOpen(true);
                setSelectedStartDateTime(formatDateAndTime(date.startDate.startDateTime));
                setAvailableSpacesOfSelected(date.availableSpaces || 0);
              }}
            />
          </ListItem>
        ))}
      </List>

      {selectedStartDateTime &&
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          startDateTime={selectedStartDateTime}
          availableSpaces={availableSpacesOfSelected}
        />
      }
    </div>
  );
}

export default TourDatesFilter;
