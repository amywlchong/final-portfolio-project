import { useMemo, useState } from "react";
import { useDateFilterModal } from "../../hooks/modals/useModals";
import { useDeleteBookingModal } from "../../hooks/modals/useModals";
import { Link } from "react-router-dom";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
  MaterialReactTable,
} from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BookingResponse, BookingRequest, Role, User } from "../../types";
import {
  formatDateAndTime,
  formatDateTimeStringToISOString,
  isDateWithinRange,
} from "../../utils/dataProcessing";
import { canAccess } from "../../utils/accessControl";
import { ApiError } from "../../utils/ApiError";
import { createServiceHandler } from "../../utils/serviceHandler";
import tourService from "../../services/tourService";
import bookingService from "../../services/bookingService";
import DateFilterModal from "../modals/searchFilters/DateFilterModal";
import DeleteBookingModal from "../modals/bookings/DeleteBookingModal";
import toast from "react-hot-toast";

interface BookingsTableProps {
  currentUser: User;
  bookings: BookingResponse[];
  setFutureBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
  setPastBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
  enableEdit: boolean;
}

const BookingsTable = ({
  currentUser,
  bookings,
  setFutureBookings,
  setPastBookings,
  enableEdit,
}: BookingsTableProps) => {
  const {
    filterDateRange,
    setFilterDateRange,
    onOpen: onDateFilterModalOpen,
  } = useDateFilterModal();

  const [isUpdating, setIsUpdating] = useState(false);
  const [availableStartDates, setAvailableStartDates] = useState<string[]>([]);
  const [newStartDate, setNewStartDate] = useState<string>("");
  const [bookingToDelete, setBookingToDelete] =
    useState<BookingResponse | null>(null);

  const deleteBookingModal = useDeleteBookingModal();

  const columns = useMemo<MRT_ColumnDef<BookingResponse>[]>(
    () => [
      {
        header: "Booking ID",
        accessorKey: "id",
        size: 100,
        enableEditing: false,
      },
      {
        header: "User ID",
        accessorKey: "userId",
        size: 100,
        enableEditing: false,
      },
      {
        header: "User Name",
        accessorKey: "userName",
        size: 200,
        enableEditing: false,
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
        enableEditing: false,
      },
      {
        header: "Location",
        accessorKey: "tourRegion",
        size: 150,
        enableEditing: false,
      },
      {
        accessorFn: (originalRow) =>
          formatDateAndTime(originalRow.startDateTime),
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
              onClick={onDateFilterModalOpen}
            />
          );
        },
        Edit: () => {
          return (
            <Select
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value as string)}
            >
              {availableStartDates.map((date) => (
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
        enableEditing: false,
      },
      {
        header: "Participant Count",
        accessorKey: "numberOfParticipants",
        size: 100,
        filterVariant: "range",
        enableEditing: false,
      },
      {
        header: "Total Price ($)",
        accessorKey: "totalPrice",
        size: 140,
        filterVariant: "range",
        enableEditing: false,
      },
      {
        accessorFn: (originalRow) => (originalRow.paid ? "Yes" : "No"),
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
              backgroundColor: row.original.paid
                ? "rgba(165, 214, 167, 0.4)"
                : "rgba(239, 154, 154, 0.4)",
              color: row.original.paid ? "#1b5e20" : "#b71c1c",
              borderRadius: "0.8rem",
              mx: "auto",
              textTransform: "uppercase",
              p: "0.5rem",
            })}
          >
            {row.original.paid ? "Yes" : "No"}
          </Box>
        ),
      },
    ],
    [availableStartDates, newStartDate]
  );

  const filterBookings = (bookings: BookingResponse[]): BookingResponse[] =>
    bookings.filter((booking) => {
      return isDateWithinRange(
        new Date(booking.startDateTime),
        filterDateRange
      );
    });

  const handleEditClick = async (
    row: MRT_Row<BookingResponse>,
    table: MRT_TableInstance<BookingResponse>
  ): Promise<void> => {
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
            .filter(
              (tourStartDate) =>
                tourStartDate.availableSpaces &&
                tourStartDate.availableSpaces > 0 &&
                new Date(tourStartDate.startDate.startDateTime).getTime() >
                  new Date().setHours(23, 59, 59, 999)
            )
            .map((tourStartDate) =>
              formatDateAndTime(tourStartDate.startDate.startDateTime)
            )
        : [];

      setAvailableStartDates(
        Array.from(
          new Set([
            ...filteredStartDates,
            formatDateAndTime(booking.startDateTime),
          ])
        )
      );
      setNewStartDate(formatDateAndTime(booking.startDateTime));
    } catch (error: any) {
      console.error(
        "Error fetching available start dates:",
        error.response?.data
      );
    }
  };

  const updateBookingHandler = createServiceHandler(
    bookingService.updateBooking,
    {
      startLoading: () => setIsUpdating(true),
      endLoading: () => setIsUpdating(false),
    },
    {
      handle: (error: ApiError) => {
        toast.error(
          error.response?.data ||
            "An unexpected error occurred while updating the booking. Please try again."
        );
      },
    }
  );

  const handleSaveBooking: MRT_TableOptions<BookingResponse>["onEditingRowSave"] =
    async ({ row, table }) => {
      if (isUpdating) {
        return;
      }

      const updatedBooking: BookingRequest = {
        userId: row.original.userId,
        tourId: row.original.tourId,
        startDateTime: formatDateTimeStringToISOString(newStartDate),
        numberOfParticipants: row.original.numberOfParticipants,
      };

      const response = await updateBookingHandler(
        row.original.id,
        updatedBooking
      );

      if (response.success && response.data) {
        setFutureBookings((prev) =>
          prev.map((b) =>
            b.id === row.original.id
              ? {
                  ...b,
                  startDateTime: formatDateTimeStringToISOString(newStartDate),
                }
              : b
          )
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
      setFutureBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingDeleted.id)
      );
    } else {
      setPastBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingDeleted.id)
      );
    }
  };

  const handleCloseDeleteModal = (): void => {
    setBookingToDelete(null);
  };

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={filterBookings(bookings)}
        enableEditing={enableEdit}
        editDisplayMode="row"
        onEditingRowSave={handleSaveBooking}
        enableRowActions={canAccess(currentUser.role, [Role.Admin])}
        enablePinning
        initialState={{ columnPinning: { right: ["mrt-row-actions"] } }}
        positionActionsColumn="last"
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            {enableEdit && (
              <Tooltip title="Edit start date & time">
                <span>
                  <IconButton
                    onClick={() => handleEditClick(row, table)}
                    disabled={!canAccess(currentUser.role, [Role.Admin])}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <IconButton
              onClick={() => handleDeleteClick(row.original)}
              color="warning"
              disabled={!canAccess(currentUser.role, [Role.Admin])}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        )}
      />

      <DateFilterModal
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
      />

      {bookingToDelete && (
        <DeleteBookingModal
          bookingToDelete={bookingToDelete}
          handleSuccessfulDelete={handleSuccessfulDelete}
          onClose={handleCloseDeleteModal}
        />
      )}
    </>
  );
};

export default BookingsTable;
