import { useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import BigNumber from 'bignumber.js';
import EditIcon from '@mui/icons-material/Edit';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, Select, MenuItem, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BookingRequest, BookingResponse } from '../../types';
import { formatDateAndTime } from '../../utils/dataProcessing';
import bookingService from '../../services/bookingService';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/reduxHooks';
import Button from '../Button';
import { createServiceHandler } from '../../utils/serviceHandler';
import { ApiError } from '../../utils/ApiError';
import tourService from '../../services/tourService';
import { BiSolidSave } from 'react-icons/bi';
import { Link } from "react-router-dom";
import { addDays, subDays } from 'date-fns';
import useDateFilterModal from '../../hooks/useDateFilterModal';
import DateFilterModal from '../modals/DateFilterModal';
import MultiSelect from '../inputs/MultiSelect';
import useDeleteBookingModal from '../../hooks/useDeleteBookingModal';
import DeleteBookingModal from '../modals/DeleteBookingModal';
import useAdminBookingModal from '../../hooks/useAdminBookingModal';
import AdminBookingModal from '../modals/AdminBookingModal';

enum PriceRange {
  VERY_LOW = "$0-5k",
  LOW = "$5k-10k",
  MEDIUM = "$10k-15k",
  HIGH = "$15k-20k",
  VERY_HIGH = "$20k+"
}

interface NumericRange {
  min: number;
  max?: number;
}

const convertToNumericRange = (priceRange: PriceRange): NumericRange => {
  let minStr: string;
  let maxStr: string | undefined;

  const cleanedPriceRange = priceRange.replace('$', '');

  if (cleanedPriceRange.includes('-')) {
    [minStr, maxStr] = cleanedPriceRange.split('-');
  } else {
    minStr = cleanedPriceRange.replace('+', '');
    maxStr = undefined;
  }

  const min = parseFloat(minStr.replace('k', '')) * 1000;
  let max: number | undefined;

  if (maxStr && maxStr !== '+') {
    max = parseFloat(maxStr.replace('k', '')) * 1000;
  }

  return { min, max };
}

const BookingsPage = () => {
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [errorFetchingBookings, setErrorFetchingBookings] = useState<ApiError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [displayPastBookings, setDisplayPastBookings] = useState(false);
  const [pastBookings, setPastBookings] = useState<BookingResponse[]>([]);
  const [futureBookings, setFutureBookings] = useState<BookingResponse[]>([]);

  const [showFilters, setShowFilters] = useState(false);
  const [filterUserNameOrId, setFilterUserNameOrId] = useState<string>('');
  const [filterBookingID, setFilterBookingID] = useState<string>('');
  const [filterTourName, setFilterTourName] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [filterDuration, setFilterDuration] = useState<string>('');
  const [filterParticipants, setFilterParticipants] = useState<string>('');
  const [filterTotalPriceRanges, setFilterTotalPriceRanges] = useState<PriceRange[]>([]);
  const [filterPaid, setFilterPaid] = useState<boolean | null>(null);

  const initialDateRange = {
    startDate: subDays(new Date(), 365),
    endDate: addDays(new Date(), 365),
    key: 'selection'
  };
  const [filterDateRange, setFilterDateRange] = useState<Range>(initialDateRange);
  const dateFilterModal = useDateFilterModal();

  const adminBookingModal = useAdminBookingModal();

  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [availableStartDates, setAvailableStartDates] = useState<string[]>([]);
  const [newStartDate, setNewStartDate] = useState<string>('');

  const [bookingToDelete, setBookingToDelete] = useState<BookingResponse | null>(null);
  const deleteBookingModal = useDeleteBookingModal();

  useEffect(() => {
    const fetchBookings = async () => {
      const getMyBookingsHandler = createServiceHandler(bookingService.getAllBookings, {
        startLoading: () => setIsLoadingBookings(true),
        endLoading: () => setIsLoadingBookings(false),
      }, { handle: (error: ApiError) => setErrorFetchingBookings(error) });

      const response = await getMyBookingsHandler();

      if (response.success && response.data) {
        const futureBookings = response.data.filter(booking => new Date(booking.startDateTime).getTime() >= new Date().getTime());
        const pastBookings = response.data.filter(booking => new Date(booking.startDateTime).getTime() < new Date().getTime());
        setPastBookings(pastBookings.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()));
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

  const isBookingDateWithinRange = (bookingDate: Date): boolean => {
    let filterStartDate: Date | undefined, filterEndDate: Date | undefined;
    if (filterDateRange.startDate) {
      filterStartDate = new Date(filterDateRange.startDate);
    }
    if (filterDateRange.endDate) {
      filterEndDate = new Date(filterDateRange.endDate);
      filterEndDate.setHours(23, 59, 59, 999);
    }

    if (filterStartDate && bookingDate.getTime() < filterStartDate.getTime()) {
      return false;
    }
    if (filterEndDate && bookingDate.getTime() > filterEndDate.getTime()) {
      return false;
    }
    return true;
  }

  const isPriceWithinRange = (booking: BookingResponse): boolean => {
    if (filterTotalPriceRanges.length === 0) return true;

    return Object.values(PriceRange).some(priceRangeValue => {
      if (!filterTotalPriceRanges.includes(priceRangeValue)) return false;

      const range = convertToNumericRange(priceRangeValue);
      if (range.max === undefined) {
        return new BigNumber(booking.totalPrice).isGreaterThan(range.min);
      }
      return new BigNumber(booking.totalPrice).isGreaterThanOrEqualTo(range.min) && new BigNumber(booking.totalPrice).isLessThanOrEqualTo(range.max);
    });
  }

  const filterBookings = (bookings: BookingResponse[]): BookingResponse[] =>
    bookings.filter(booking => {
      return (
        ((!filterUserNameOrId) ||
        (booking.userName?.toLowerCase().includes(filterUserNameOrId.toLowerCase()) ||
        booking.userId?.toString().includes(filterUserNameOrId))) &&
        (booking.id?.toString().includes(filterBookingID)) &&
        (booking.tourName.toLowerCase().includes(filterTourName.toLowerCase())) &&
        (booking.tourRegion.toLowerCase().includes(filterRegion.toLowerCase())) &&
        isBookingDateWithinRange(new Date(booking.startDateTime)) &&
        (booking.tourDuration.toString().includes(filterDuration)) &&
        (booking.numberOfParticipants.toString().includes(filterParticipants)) &&
        isPriceWithinRange(booking) &&
        (filterPaid === null || booking.paid === filterPaid)
      );
    });

  const handleEditClick = async (booking: BookingResponse) => {
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
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred while updating the booking. Please try again.")}});

  const handleSaveDateChange = async (bookingId: number, existingBooking: BookingResponse) => {
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
      setNewStartDate('');
    }
  };

  const isBookingInFuture = (booking: BookingResponse): boolean => {
    return new Date(booking.startDateTime) >= new Date();
  };

  const handleDeleteClick = (booking: BookingResponse) => {
    setBookingToDelete(booking);
    deleteBookingModal.onOpen();
  };

  const handleSuccessfulDelete = (bookingDeleted: BookingResponse) => {
    const isFuture = isBookingInFuture(bookingDeleted);
    if (isFuture) {
      setFutureBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingDeleted.id));
    } else {
      setPastBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingDeleted.id));
    }
  };

  const handleCloseDeleteModal = () => {
    setBookingToDelete(null);
  };

  const renderTableFilters = (enableEdit: boolean) => {
    return (
      <TableRow>
        {enableEdit && <TableCell></TableCell>}
        <TableCell></TableCell>
        <TableCell style={{ padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Booking ID"
            value={filterBookingID}
            onChange={e => setFilterBookingID(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by User Name or ID"
            value={filterUserNameOrId}
            onChange={(e) => setFilterUserNameOrId(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Tour Name"
            value={filterTourName}
            onChange={e => setFilterTourName(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Location"
            value={filterRegion}
            onChange={e => setFilterRegion(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Start Date"
            value=""
            onClick={dateFilterModal.onOpen}
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Duration"
            value={filterDuration}
            onChange={e => setFilterDuration(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Participant Count"
            value={filterParticipants}
            onChange={e => setFilterParticipants(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <MultiSelect
            label="Filter by Price"
            selectedOptions={filterTotalPriceRanges}
            setSelectedOptions={setFilterTotalPriceRanges}
            menuItems={Object.values(PriceRange).map(priceValue => (
              <MenuItem key={priceValue} value={priceValue}>
                {priceValue}
              </MenuItem>
            ))}
            formControlSize="small"
          />
        </TableCell>
        <TableCell style={{ padding: '10px' }}>
          <Select
            size="small"
            placeholder="Filter by Payment Status"
            value={filterPaid === null ? '' : filterPaid ? 'Yes' : 'No'}
            onChange={(e) => {
              if (e.target.value === 'Yes') {
                setFilterPaid(true);
              } else if (e.target.value === 'No') {
                setFilterPaid(false);
              } else {
                setFilterPaid(null);
              }
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </TableCell>
      </TableRow>
    )
  }

  const renderTableHeaders = (enableEdit: boolean) => {
    return (
      <TableRow>
        {enableEdit && <TableCell>Edit</TableCell>}
        <TableCell>Delete</TableCell>
        <TableCell>Booking ID</TableCell>
        <TableCell>User Name & ID</TableCell>
        <TableCell>Tour Name</TableCell>
        <TableCell>Region</TableCell>
        <TableCell>Start Date & Time</TableCell>
        <TableCell>Duration (days)</TableCell>
        <TableCell>Participant Count</TableCell>
        <TableCell>Total Price</TableCell>
        <TableCell>Paid</TableCell>
      </TableRow>
    )
  }

  const renderTableRows = (tableBookings: BookingResponse[], enableEdit: boolean) => {
    return (
      <>
        {tableBookings.map((booking) => (
          <TableRow key={booking.id}>
            {enableEdit &&
              <TableCell>
                <EditIcon
                  onClick={() => handleEditClick(booking)}
                  style={{ cursor: 'pointer' }}
                />
              </TableCell>
            }
            <TableCell>
              <IconButton onClick={() => handleDeleteClick(booking)} color="warning">
                <DeleteForeverIcon />
              </IconButton>
            </TableCell>
            <TableCell>{booking.id}</TableCell>
            <TableCell>{`${booking.userName} (ID: ${booking.userId})`}</TableCell>
            <TableCell>
              <Link to={`/tours/${booking.tourId}`}>
                {booking.tourName}
              </Link>
            </TableCell>
            <TableCell>{booking.tourRegion}</TableCell>
            {enableEdit && (
              <TableCell>
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
                  formatDateAndTime(booking.startDateTime)
                )}
              </TableCell>
            )}
            {!enableEdit && (
              <TableCell>{formatDateAndTime(booking.startDateTime)}</TableCell>
            )}
            <TableCell>{booking.tourDuration}</TableCell>
            <TableCell>{booking.numberOfParticipants}</TableCell>
            <TableCell>${booking.totalPrice}</TableCell>
            <TableCell>{booking.paid ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </>
    )
  }

  const renderTable = (
    tableBookings: BookingResponse[],
    enableEdit = false
  ) => (
    <Table>
      <TableHead>
        {showFilters && renderTableFilters(enableEdit)}
        {renderTableHeaders(enableEdit)}
      </TableHead>
      <TableBody>
        {renderTableRows(tableBookings, enableEdit)}
      </TableBody>
    </Table>
  )

  return (
    <div>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1">Bookings</Typography>
        <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button label={showFilters ? "Hide Filters" : "Show Filters"} onClick={() => setShowFilters(prevState => !prevState)} outline sx={{marginRight: 2}} />
          <Button label={displayPastBookings ? "Future Bookings" : "Past Bookings"} onClick={() => setDisplayPastBookings(prev => !prev)} sx={{ marginRight: 2 }} />
          <Button label="New Booking" onClick={adminBookingModal.onOpen} />
        </Box>
      </Box>

      {!displayPastBookings && (
        <Box mt={2}>
          <Typography variant="h2">Future Tours</Typography>
          <TableContainer component={Paper}>
            {renderTable(filterBookings(futureBookings), true)}
          </TableContainer>
        </Box>
      )}

      {displayPastBookings && (
        <Box mt={2}>
          <Typography variant="h2">Past Tours</Typography>
          <TableContainer component={Paper}>
            {renderTable(filterBookings(pastBookings), false)}
          </TableContainer>
        </Box>
      )}

      <DateFilterModal
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
      />

      <AdminBookingModal
        setFutureBookings={setFutureBookings}
      />

      {bookingToDelete &&
        <DeleteBookingModal
          bookingToDelete={bookingToDelete}
          handleSuccessfulDelete={handleSuccessfulDelete}
          onClose={handleCloseDeleteModal}
        />
      }
    </div>
  );
};

export default BookingsPage;
