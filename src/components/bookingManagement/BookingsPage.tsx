import { useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import EditIcon from "@mui/icons-material/Edit";
import { TableContainer, Paper, Typography, Box, IconButton, Tooltip, Select, MenuItem, TextField } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BookingRequest, BookingResponse } from "../../types";
import { formatDateAndTime, convertToISOlikeFormat } from "../../utils/dataProcessing";
import bookingService from "../../services/bookingService";
import toast from "react-hot-toast";
import { useAppSelector } from "../../app/reduxHooks";
import Button from "../Button";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import tourService from "../../services/tourService";
import { addDays, subDays } from "date-fns";
import useDateFilterModal from "../../hooks/useDateFilterModal";
import DateFilterModal from "../modals/DateFilterModal";
import useDeleteBookingModal from "../../hooks/useDeleteBookingModal";
import DeleteBookingModal from "../modals/DeleteBookingModal";
import useAdminBookingModal from "../../hooks/useAdminBookingModal";
import AdminBookingModal from "../modals/AdminBookingModal";
import { MRT_ColumnDef, MRT_Row, MRT_TableInstance, MRT_TableOptions, MaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize";

const BookingsPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [errorFetchingBookings, setErrorFetchingBookings] = useState<ApiError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [displayPastBookings, setDisplayPastBookings] = useState(false);
  const [pastBookings, setPastBookings] = useState<BookingResponse[]>([]);
  const [futureBookings, setFutureBookings] = useState<BookingResponse[]>([]);

  const initialDateRange = {
    startDate: subDays(new Date(), 365),
    endDate: addDays(new Date(), 365),
    key: "selection"
  };
  const [filterDateRange, setFilterDateRange] = useState<Range>(initialDateRange);
  const dateFilterModal = useDateFilterModal();

  const adminBookingModal = useAdminBookingModal();

  const [availableStartDates, setAvailableStartDates] = useState<string[]>([]);
  const [newStartDate, setNewStartDate] = useState<string>("");

  const [bookingToDelete, setBookingToDelete] = useState<BookingResponse | null>(null);
  const deleteBookingModal = useDeleteBookingModal();

  const columns = useMemo<MRT_ColumnDef<BookingResponse>[]>(
    () => [
      {
        header: "Booking ID",
        accessorKey: "id",
        size: 100,
        enableEditing: false
      },
      {
        header: "User ID",
        accessorKey: "userId",
        size: 100,
        enableEditing: false
      },
      {
        header: "User Name",
        accessorKey: "userName",
        size: 200,
        enableEditing: false
      },
      {
        header: "Tour Name",
        accessorKey: "tourName",
        size: 200,
        Cell: ({ row }: { row: { original: BookingResponse } }) => (
          <Link to={`/tours/${row.original.tourId}`}>
            {row.original.tourName}
          </Link>
        ),
        enableEditing: false
      },
      {
        header: "Location",
        accessorKey: "tourRegion",
        size: 150,
        enableEditing: false
      },
      {
        accessorFn: (originalRow) => formatDateAndTime(originalRow.startDateTime),
        id: "startDateTime",
        header: "Start Date & Time",
        size: 180,
        Filter: () => {
          return (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Filter by Start Date"
              value=""
              onClick={dateFilterModal.onOpen}
            />
          );
        },
        Edit: () => {
          return (
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
          );
        },
      },
      {
        header: "Duration (days)",
        accessorKey: "tourDuration",
        size: 100,
        filterVariant: "range",
        enableEditing: false
      },
      {
        header: "Participant Count",
        accessorKey: "numberOfParticipants",
        size: 100,
        filterVariant: "range",
        enableEditing: false
      },
      {
        header: "Total Price ($)",
        accessorKey: "totalPrice",
        size: 140,
        filterVariant: "range",
        enableEditing: false
      },
      {
        accessorFn: (originalRow) => originalRow.paid ? "Yes" : "No",
        id: "paid",
        header: "Paid",
        size: 60,
        filterVariant: "select",
        filterSelectOptions: ["Yes", "No"],
        enableEditing: false,
        Cell: ({ row }: { row: { original: BookingResponse } }) => (
          <Box
            component="span"
            sx={() => ({
              backgroundColor:
                row.original.paid
                  ? "rgba(165, 214, 167, 0.4)"
                  : "rgba(239, 154, 154, 0.4)",
              color:
                row.original.paid
                  ? "#1b5e20"
                  : "#b71c1c",
              borderRadius: "0.8rem",
              mx: "auto",
              textTransform: "uppercase",
              p: "0.5rem",
            })}
          >
            {row.original.paid ? "Yes" : "No"}
          </Box>
        ),
      }
    ],
    [availableStartDates, newStartDate]
  );

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
  };

  const filterBookings = (bookings: BookingResponse[]): BookingResponse[] =>
    bookings.filter(booking => {
      return (
        isBookingDateWithinRange(new Date(booking.startDateTime))
      );
    });

  const handleEditClick = async (row: MRT_Row<BookingResponse>, table: MRT_TableInstance<BookingResponse>): Promise<void> => {
    table.setEditingRow(row);
    const booking = row.original;

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
          .map(tourStartDate => formatDateAndTime(tourStartDate.startDate.startDateTime))
        : [];

      setAvailableStartDates(Array.from(new Set([...filteredStartDates, formatDateAndTime(booking.startDateTime)])));
      setNewStartDate(formatDateAndTime(booking.startDateTime));
    } catch (error: any) {
      console.error("Error fetching available start dates:", error.response?.data);
    }
  };

  const updateBookingHandler = createServiceHandler(bookingService.updateBooking, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred while updating the booking. Please try again.");}});

  const handleSaveBooking: MRT_TableOptions<BookingResponse>["onEditingRowSave"] = async ({
    row,
    table,
  }) => {

    if (isUpdating) {
      return;
    }

    const updatedBooking: BookingRequest = {
      userId: row.original.userId,
      tourId: row.original.tourId,
      startDateTime: convertToISOlikeFormat(newStartDate),
      numberOfParticipants: row.original.numberOfParticipants
    };

    const response = await updateBookingHandler(row.original.id, updatedBooking);

    if (response.success && response.data) {
      setFutureBookings(prev =>
        prev.map(b => b.id === row.original.id ? { ...b, startDateTime: convertToISOlikeFormat(newStartDate) } : b)
      );
      toast.success("Booking updated.");
      table.setEditingRow(null);
      setNewStartDate("");
    }
  };

  const handleDeleteClick = (booking: BookingResponse): void => {
    setBookingToDelete(booking);
    deleteBookingModal.onOpen();
  };

  const isBookingInFuture = (booking: BookingResponse): boolean => {
    return new Date(booking.startDateTime) >= new Date();
  };

  const handleSuccessfulDelete = (bookingDeleted: BookingResponse): void => {
    const isFuture = isBookingInFuture(bookingDeleted);
    if (isFuture) {
      setFutureBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingDeleted.id));
    } else {
      setPastBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingDeleted.id));
    }
  };

  const handleCloseDeleteModal = (): void => {
    setBookingToDelete(null);
  };

  const renderTable = (
    tableBookings: BookingResponse[],
    enableEdit = false
  ) => (
    <MaterialReactTable
      columns={columns}
      data={tableBookings}
      enableEditing={enableEdit}
      editDisplayMode='row'
      onEditingRowSave={handleSaveBooking}
      enableRowActions
      enablePinning
      initialState={{ columnPinning: { right: ["mrt-row-actions"] } }}
      positionActionsColumn="last"
      displayColumnDefOptions={{
        "mrt-row-actions": {
          muiTableHeadCellProps: {
            align: "center",
          }
        }
      }}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
          {enableEdit &&
            <Tooltip title="Edit start date & time">
              <IconButton onClick={() => handleEditClick(row, table)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          }
          <IconButton onClick={() => handleDeleteClick(row.original)} color="warning">
            <DeleteForeverIcon />
          </IconButton>
        </Box>
      )}
    />
  );

  return (
    <div>
      <Box style={{ display: "flex", flexDirection: `${isSmallAndUp ? "row" : "column"}`, justifyContent: "space-between", alignItems: `${isSmallAndUp ? "center" : "flex-start"}` }}>
        <Typography variant="h1">Bookings</Typography>
        <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
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
