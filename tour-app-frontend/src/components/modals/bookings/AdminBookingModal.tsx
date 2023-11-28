import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/reduxHooks";
import BigNumber from "bignumber.js";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  AdminBookingFormValues,
  BookingRequest,
  BookingResponse,
  FieldValues,
  Role,
  Tour,
  User,
} from "../../../types";
import { formatDateAndTime } from "../../../utils/dataProcessing";
import { useAdminBookingModal } from "../../../hooks/modals/useModals";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";
import bookingService from "../../../services/bookingService";
import userService from "../../../services/userService";
import tourService from "../../../services/tourService";
import _ from "lodash-es";
import toast from "react-hot-toast";
import Input from "../../inputs/Input";
import AutocompleteController from "../../inputs/AutocompleteController";
import LabeledText from "../../ui/LabeledText";
import Modal from "../Modal";

interface AdminBookingModalProps {
  setFutureBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
}

const AdminBookingModal = ({ setFutureBookings }: AdminBookingModalProps) => {
  const adminBookingModal = useAdminBookingModal();
  const currentUser = useAppSelector((state) => state.user.loggedInUser);

  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isFetchingTourDetails, setIsFetchingTourDetails] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  const [activeCustomers, setActiveCustomers] = useState<User[]>([]);
  const tours = useAppSelector((state) => state.tours.allTours);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const defaultBookingFormValues: AdminBookingFormValues = {
    participants: 1,
    user: null,
    tourName: null,
    tour: null,
    tourStartDate: null,
  };
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: defaultBookingFormValues,
  });

  useEffect(() => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: "❗" });
      return;
    }

    const fetchActiveCustomers = async () => {
      const getAllUsersHandler = createServiceHandler(
        userService.getAllUsers,
        {
          startLoading: () => setIsFetchingUsers(true),
          endLoading: () => setIsFetchingUsers(false),
        },
        {
          handle: (error: ApiError) => {
            toast.error(
              error.response?.data ||
                "An unexpected error occurred while fetching users."
            );
          },
        }
      );

      const response = await getAllUsersHandler();

      if (response.success && response.data) {
        setActiveCustomers(
          response.data.filter(
            (user) => user.active && user.role === Role.Customer
          )
        );
      }
    };

    fetchActiveCustomers();
  }, [currentUser]);

  if (!tours) {
    return <div>No tours found.</div>;
  }

  if (!currentUser) {
    return <></>;
  }

  const getCustomerNameAndId = (customer?: User | null): string => {
    if (!customer) return "";
    return `${customer.name} (ID: ${customer.id})`;
  };

  const handleTourNameChange = async (newValue: string | null) => {
    setValue("tourStartDate", null);
    const selectedTourId = tours.find((tour) => tour.name === newValue)?.id;

    if (!selectedTourId) {
      toast.error("Error fetching tour details - undefined tour id");
      return;
    }

    const getTourHandler = createServiceHandler(
      tourService.getOneTour,
      {
        startLoading: () => setIsFetchingTourDetails(true),
        endLoading: () => setIsFetchingTourDetails(false),
      },
      {
        handle: (error: ApiError) => {
          toast.error(
            error.response?.data ||
              "An unexpected error occurred while fetching tour details."
          );
        },
      }
    );

    const response = await getTourHandler(selectedTourId);

    if (response.success && response.data) {
      setSelectedTour(response.data);
    }
  };

  const availableTourStartDates =
    selectedTour && selectedTour.tourStartDates
      ? selectedTour.tourStartDates
          .filter(
            (tsd) =>
              new Date(tsd.startDate.startDateTime).getTime() >=
              new Date().getTime()
          )
          .filter((tsd) => tsd.availableSpaces && tsd.availableSpaces > 0)
      : [];

  const onModalClose = () => {
    reset(defaultBookingFormValues);
    setSelectedTour(null);
    adminBookingModal.onClose();
  };

  const createBookingHandler = createServiceHandler(
    bookingService.createBooking,
    {
      startLoading: () => setIsCreatingBooking(true),
      endLoading: () => setIsCreatingBooking(false),
    },
    {
      handle: (error: ApiError) => {
        if (error.response?.data.includes("Duplicate entry")) {
          toast.error(
            "User has already booked this tour for the selected date."
          );
        } else {
          toast.error("An error occurred. Please click CONFIRM to try again.");
        }
      },
    }
  );

  const onSubmit = async () => {
    if (!watch("user") || !selectedTour || !watch("tourStartDate")) {
      toast.error(
        "Please fill out all required fields - user, tour, start date & time, and number of participants."
      );
      return;
    }

    const bookingInfo: BookingRequest = {
      userId: watch("user").id,
      tourId: selectedTour.id,
      startDateTime: watch("tourStartDate").startDate.startDateTime,
      numberOfParticipants: watch("participants"),
    };

    const response = await createBookingHandler(bookingInfo);
    if (response.success && response.data) {
      setFutureBookings((prevBookings) => [
        ...prevBookings,
        response.data as BookingResponse,
      ]);
      toast.success("Booking created successfully");
      onModalClose();
    }
  };

  const title = "New Booking";
  const actionLabel = "Create";
  const bodyContent = (
    <div>
      <Box mb={2}>
        <AutocompleteController
          id="user"
          control={control}
          rules={{ required: true }}
          defaultValue={null}
          label="User Name & ID"
          boldLabel
          options={activeCustomers}
          getOptionLabel={getCustomerNameAndId}
          errors={errors}
          disabled={isFetchingUsers || isCreatingBooking}
          placeholder="Select User Name or ID"
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
        />
      </Box>
      <Box mt={2} mb={2}>
        <AutocompleteController
          id="tourName"
          control={control}
          rules={{ required: true }}
          defaultValue={null}
          label="Tour Name"
          boldLabel
          options={tours.map((tour) => tour.name)}
          onChange={(newValue) => handleTourNameChange(newValue)}
          errors={errors}
          disabled={isFetchingTourDetails || isCreatingBooking}
          placeholder="Select Tour Name"
        />
      </Box>
      {selectedTour && (
        <Box mt={2} mb={2}>
          <AutocompleteController
            id="tourStartDate"
            control={control}
            rules={{ required: true }}
            defaultValue={null}
            label="Start Date & Time"
            boldLabel
            options={availableTourStartDates}
            getOptionLabel={(option) =>
              formatDateAndTime(option.startDate.startDateTime)
            }
            errors={errors}
            disabled={isFetchingTourDetails || isCreatingBooking}
            placeholder="Select Start Date & Time"
            isOptionEqualToValue={(option, value) =>
              _.isEqual(option?.id, value?.id)
            }
          />
        </Box>
      )}
      <LabeledText
        label="Duration"
        value={
          selectedTour?.duration
            ? `${selectedTour?.duration} ${
                selectedTour?.duration > 1 ? "days" : "day"
              }`
            : ""
        }
      />
      <Input
        id="participants"
        label="Number of Participants: "
        boldLabel
        type="number"
        disabled={isFetchingTourDetails || isCreatingBooking}
        min={1}
        max={watch("tourStartDate")?.availableSpaces}
        register={register}
        errors={errors}
        required
      />
      <LabeledText
        label="Price"
        value={`$${selectedTour?.price || ""} per person`}
      />
      <LabeledText
        label="Total"
        value={
          selectedTour?.price
            ? new BigNumber(selectedTour?.price)
                .times(watch("participants"))
                .toString()
            : ""
        }
      />
    </div>
  );

  return (
    <Modal
      disabled={isFetchingUsers || isFetchingTourDetails || isCreatingBooking}
      isOpen={adminBookingModal.isOpen}
      title={title}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onModalClose}
      body={bodyContent}
    />
  );
};

export default AdminBookingModal;
