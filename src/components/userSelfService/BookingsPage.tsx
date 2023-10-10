import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TableSortLabel, Box, Select, MenuItem } from '@mui/material';
import { BookingRequest, BookingResponse } from '../../types';
import { formatDateAndTime, getCurrentDateTimeInISOlikeFormat } from '../../utils/dataProcessing';
import bookingService from '../../services/bookingService';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/reduxHooks';
import Button from '../Button';
import { createServiceHandler } from '../../utils/serviceHandler';
import { ApiError } from '../../utils/ApiError';
import useReviewModal from '../../hooks/useReviewModal';
import ReviewModal from '../modals/ReviewModal';
import tourService from '../../services/tourService';
import { BiSolidSave } from 'react-icons/bi';

type SortFields = 'startDateTime' | 'tourDuration' | 'numberOfParticipants' | 'totalPrice' | 'paid';
type SortDirection = 'asc' | 'desc';

const BookingsPage = () => {
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [errorFetchingBookings, setErrorFetchingBookings] = useState<ApiError | null>(null);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [pastBookings, setPastBookings] = useState<BookingResponse[]>([]);
  const [futureBookings, setFutureBookings] = useState<BookingResponse[]>([]);

  const [futureSortField, setFutureSortField] = useState<SortFields>('startDateTime');
  const [futureSortDirection, setFutureSortDirection] = useState<SortDirection>('asc');

  const [pastSortField, setPastSortField] = useState<SortFields>('startDateTime');
  const [pastSortDirection, setPastSortDirection] = useState<SortDirection>('asc');

  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [availableStartDates, setAvailableStartDates] = useState<string[]>([]);
  const [newStartDate, setNewStartDate] = useState<string>('');

  const [bookingIdOfReview, setBookingIdOfReview] = useState<number | null>(null);
  const reviewModal = useReviewModal();

  useEffect(() => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: '❗' });
      return;
    }

    const fetchBookings = async () => {
      const getMyBookingsHandler = createServiceHandler(bookingService.getMyBookings, {
        startLoading: () => setIsLoadingBookings(true),
        endLoading: () => setIsLoadingBookings(false),
      }, { handle: (error: ApiError) => setErrorFetchingBookings(error) });

      const response = await getMyBookingsHandler();

      if (response.success && response.data) {
        const currentDateTime = getCurrentDateTimeInISOlikeFormat();
        const futureBookings = response.data.filter(booking => booking.startDateTime >= currentDateTime);
        const pastBookings = response.data.filter(booking => booking.startDateTime < currentDateTime);
        setPastBookings(pastBookings.sort((a, b) => (a.startDateTime > b.startDateTime) ? 1 : -1));
        setFutureBookings(futureBookings.sort((a, b) => (a.startDateTime > b.startDateTime) ? 1 : -1));
        setErrorFetchingBookings(null);
      }
    };

    fetchBookings();
  }, [currentUser]);

  if (isLoadingBookings) {
    return <div>Loading...</div>;
  }

  if (errorFetchingBookings) {
    return <div>Error: An error occurred while fetching bookings.</div>;
  }

  const handleSort = (
    field: SortFields,
    setSortField: React.Dispatch<React.SetStateAction<SortFields>>,
    bookings: BookingResponse[],
    setBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>,
    currentDirection: SortDirection,
    setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>
  ) => {
    const direction = currentDirection === 'asc' ? 'desc' : 'asc';

    const sortedBookings = [...bookings].sort((a, b) => {
      let comparison = 0;
      if (a[field] > b[field]) comparison = 1;
      if (a[field] < b[field]) comparison = -1;
      return direction === 'asc' ? comparison : -comparison;
    });

    setBookings(sortedBookings);
    setSortField(field);
    setSortDirection(direction);
  };

  const handleEditClick = async (booking: BookingResponse) => {
    try {
        const tourDetails = await tourService.getOneTour(booking.tourId);
        if (!tourDetails) {
          throw new Error("Error fetching tour details.");
        }
        const tourStartDates = tourDetails.tourStartDates;
        const filteredStartDates = tourStartDates
          ? tourStartDates.filter(tourStartDate => tourStartDate && tourStartDate.availableSpaces && tourStartDate.availableSpaces > 0)
                          .map(tourStartDate => tourStartDate.startDate.startDateTime)
          :[];

        setAvailableStartDates(filteredStartDates);
        setEditingBookingId(booking.id);
        setNewStartDate(booking.startDateTime);
    } catch (error: any) {
        console.error("Error fetching available start dates:", error.response?.data);
    }
  };

  const handleSaveDateChange = async (bookingId: number, existingBooking: BookingResponse) => {
    const updatedBooking: BookingRequest = {
      userId: existingBooking.userId,
      tourId: existingBooking.tourId,
      startDateTime: newStartDate,
      numberOfParticipants: existingBooking.numberOfParticipants
    };

    try {
      await bookingService.updateBooking(bookingId, updatedBooking);
      setFutureBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, startDateTime: newStartDate } : b)
      );
      toast.success("Booking updated.");
      setEditingBookingId(null);
      setNewStartDate('');
    } catch(error: any) {
      console.error("Error updating booking:", error.response?.data);
      toast.error(error.response?.data || "An error occurred while updating the booking.");
    }
  };

  const renderTable = (
    tableBookings: BookingResponse[],
    sortField: SortFields,
    sortDirection: SortDirection,
    setBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>,
    setSortField: React.Dispatch<React.SetStateAction<SortFields>>,
    setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>,
    enableEdit = false,
    enableReviewButton = false
  ) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Tour Name</TableCell>
          <TableCell>Region</TableCell>
          <TableCell>
            <TableSortLabel active={sortField === 'startDateTime'} direction={sortDirection} onClick={() => handleSort('startDateTime', setSortField, tableBookings, setBookings, sortDirection, setSortDirection)}>
              Start Date & Time
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel active={sortField === 'tourDuration'} direction={sortDirection} onClick={() => handleSort('tourDuration', setSortField, tableBookings, setBookings, sortDirection, setSortDirection)}>
              Duration
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel active={sortField === 'numberOfParticipants'} direction={sortDirection} onClick={() => handleSort('numberOfParticipants', setSortField, tableBookings, setBookings, sortDirection, setSortDirection)}>
              Participants
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel active={sortField === 'totalPrice'} direction={sortDirection} onClick={() => handleSort('totalPrice', setSortField, tableBookings, setBookings, sortDirection, setSortDirection)}>
              Total Price
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel active={sortField === 'paid'} direction={sortDirection} onClick={() => handleSort('paid', setSortField, tableBookings, setBookings, sortDirection, setSortDirection)}>
              Paid
            </TableSortLabel>
          </TableCell>
          <TableCell>Review</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableBookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.id}</TableCell>
            <TableCell>{booking.tourName}</TableCell>
            <TableCell>{booking.tourRegion}</TableCell>
            {enableEdit && (
              <TableCell style={{ display: 'flex', alignItems: 'center' }}>
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
                    />
                  </>
                ) : (
                  formatDateAndTime(booking.startDateTime)
                )}
                <EditIcon
                  onClick={() => handleEditClick(booking)}
                  style={{ cursor: 'pointer', marginLeft: '10px' }}
                />
              </TableCell>
            )}
            {!enableEdit && (
              <TableCell>{formatDateAndTime(booking.startDateTime)}</TableCell>
            )}
            <TableCell>{`${booking.tourDuration} ${booking.tourDuration > 1 ? 'days' : 'day'}`}</TableCell>
            <TableCell>{`${booking.numberOfParticipants} ${booking.numberOfParticipants > 1 ? 'people' : 'person'}`}</TableCell>
            <TableCell>${booking.totalPrice}</TableCell>
            <TableCell>{booking.paid ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              <Button
                label="Review"
                disabled={!enableReviewButton}
                onClick={() => {
                  setBookingIdOfReview(booking.id);
                  reviewModal.onOpen();
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div>
      <Typography variant="h1">My Bookings</Typography>

      <Box mt={2}>
        <Typography variant="h2">Future Tours</Typography>
        <TableContainer component={Paper}>
          {renderTable(futureBookings, futureSortField, futureSortDirection, setFutureBookings, setFutureSortField, setFutureSortDirection, true, false)}
        </TableContainer>
      </Box>

      <Box mt={2}>
        <Typography variant="h2">Past Tours</Typography>
        <TableContainer component={Paper}>
          {renderTable(pastBookings, pastSortField, pastSortDirection, setPastBookings, setPastSortField, setPastSortDirection, false, true)}
        </TableContainer>
      </Box>

      {bookingIdOfReview && <ReviewModal bookingId={bookingIdOfReview} />}
    </div>
  );
};

export default BookingsPage;
