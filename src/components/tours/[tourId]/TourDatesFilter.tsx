import { useState } from 'react';
import { Range } from 'react-date-range';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import { addDays } from 'date-fns';
import DatePicker from '../../inputs/DatePicker';
import { TourStartDate } from '../../../types';

interface TourDatesFilterProps {
  tourStartDates: TourStartDate[];
  tourDuration: number;
}

const TourDatesFilter = ({ tourStartDates, tourDuration }: TourDatesFilterProps) => {
  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: 'selection'
  };
  const [userAvailability, setUserAvailability] = useState<Range>(initialDateRange);

  const filteredTourStartDates = tourStartDates.filter(date => {
    const tourStartDate = new Date(date.startDate.startDateTime);
    const tourEndDate = addDays(tourStartDate, (tourDuration - 1));

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
          <ListItem key={date.id.startDateId}>
            <ListItemText
              primary={new Date(date.startDate.startDateTime).toDateString()}
              secondary={`Available Spaces: ${date.availableSpaces}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default TourDatesFilter;
