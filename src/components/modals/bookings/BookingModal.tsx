import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../../app/reduxHooks";
import Modal from "../Modal";
import BigNumber from "bignumber.js";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  BookingRequest,
  BookingResponse,
  FieldValues,
} from "../../../types";
import { formatDateTimeStringToISOString, formatDateAndTime } from "../../../utils/dataProcessing";
import { useBookingModal } from "../../../hooks/modals/useModals";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";
import bookingService from "../../../services/bookingService";
import paymentService from "../../../services/paymentService";
import { FUNDING, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import Input from "../../inputs/Input";
import LabeledText from "../../ui/LabeledText";

interface BookingModalProps {
  startDateTime: string;
  availableSpaces: number;
}

const BookingModal = ({ startDateTime, availableSpaces }: BookingModalProps) => {
  const bookingModal = useBookingModal();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const tour = useAppSelector(state => state.tours.currentTour);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
  enum STEPS {
    CONFIRM = 0,
    PAY = 1,
    PAID = 2,
  }
  const [step, setStep] = useState(STEPS.CONFIRM);

  const defaultBookingFormValues = {
    participants: 1,
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: defaultBookingFormValues,
  });
  const watchedParticipants: number = watch("participants");

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: "❗" });
    }
  }, [currentUser]);

  if (!tour) {
    return <div>An error occurred.</div>;
  }

  if (!currentUser) {
    return <></>;
  }

  const onModalClose = () => {
    if (step === STEPS.PAID) {
      setStep(STEPS.CONFIRM);
    }
    reset(defaultBookingFormValues);
    bookingModal.onClose();
  };

  const startLoading = () => setIsLoading(true);
  const endLoading = () => setIsLoading(false);

  const createBookingHandler = createServiceHandler(
    bookingService.createBooking,
    { startLoading, endLoading },
    {
      handle: (error: ApiError) => {
        if (error.response?.data.includes("Duplicate entry")) {
          toast.error("You've already booked this tour for the selected date.");
        } else {
          toast.error("An error occurred. Please click CONFIRM to try again.");
        }
      },
    }
  );

  const createOrderHandler = createServiceHandler(
    paymentService.initiatePayment,
    { startLoading, endLoading },
    {
      handle: (_error: ApiError) => {
        console.error("Error during order creation.");
      }
    }
  );

  const capturePaymentHandler = createServiceHandler(
    paymentService.capturePayment,
    { startLoading, endLoading },
    {
      handle: (_error: ApiError) => {
        console.error("Error during payment capture.");
      }
    }
  );

  const onSubmit = async () => {
    if (step === STEPS.CONFIRM) {
      const bookingInfo: BookingRequest = {
        userId: currentUser.id,
        tourId: tour.id,
        startDateTime: formatDateTimeStringToISOString(startDateTime),
        numberOfParticipants: watchedParticipants,
      };

      const response = await createBookingHandler(bookingInfo);
      if (response.success && response.data) {
        setBookingResponse(response.data);
        console.log("Booking created successfully");
        onNext();
      }
    }

    if (step === STEPS.PAID) {
      onModalClose();
    }
  };

  let title = "";
  let actionLabel = "";
  let bodyContent;

  if (step === STEPS.CONFIRM) {
    title="Book Tour";
    actionLabel="Confirm";
    bodyContent = (
      <div>
        <LabeledText label="Tour" value={tour.name} />
        <LabeledText label="Location" value={tour.region} />
        <LabeledText label="Start Date & Time" value={startDateTime} />
        <LabeledText label="Duration" value={`${tour.duration} ${tour.duration > 1 ? "days" : "day"}`} />
        <Input
          id="participants"
          label="Number of Participants: "
          boldLabel
          type="number"
          disabled={isLoading}
          min={1}
          max={availableSpaces}
          register={register}
          errors={errors}
          required
        />
        <LabeledText label="Price" value={`$${tour.price} per person`} />
        <LabeledText label="Total" value={`$${(new BigNumber(tour.price)).times(watchedParticipants).toString()}`} />
      </div>
    );
  }

  if (step === STEPS.PAY) {
    if (!bookingResponse) {
      toast.error("An error occurred.");
      return <></>;
    }
    title="Complete Payment";
    bodyContent = (
      <div>
        <Typography variant="body1" fontWeight="bold">You will be redirected to PayPal to complete your payment securely.</Typography>
        <LabeledText label="Tour" value={bookingResponse.tourName} />
        <LabeledText label="Price" value={`$${bookingResponse.unitPrice} per person`} />
        <LabeledText label="Total" value={`$${bookingResponse.totalPrice}`} />
        <Box mt={2}>
          <Typography variant="body2" fontWeight="bold">Booking & Payment Policy</Typography>
          <Typography variant="body2">Thank you for choosing to book a tour with us. Please note the following important guidelines regarding bookings and payments:</Typography>
          <Typography variant="body2">Immediate Payment: Please proceed to make an immediate payment via PayPal to complete the booking process.</Typography>
          <Typography variant="body2">No Reservations without Payment: We cannot reserve places on the tour without receiving full payment. Your spots are only confirmed once the payment is successfully made.</Typography>
          <Typography variant="body2">Non-cancellable & Non-refundable: Once paid for, all bookings are non-cancellable and non-refundable.</Typography>
          <Typography variant="body2">We appreciate your understanding and cooperation. This policy ensures fairness to all our guests and helps us maintain the quality of our tours.</Typography>
        </Box>
        <Box mt={2}>
          <PayPalButtons
            fundingSource={FUNDING.PAYPAL}
            createOrder={async () => {
              const response = await createOrderHandler(bookingResponse.id);
              if (response.success && response.data) {
                console.log("Order created successfully");
                return response.data;
              }
              throw new Error("Order creation failed.");
            }}
            onApprove={async (data) => {
              const response = await capturePaymentHandler({ bookingId: bookingResponse.id, orderId: data.orderID });
              if (response.success && response.data && response.data.status === "COMPLETED") {
                console.log("Payment captured successfully");
                onNext();
              } else {
                throw new Error("Payment failed");
              }
            }}
            onError={(error: any) => {
              toast.error(error?.message || "An error occurred during the payment process. Please try again.");
            }}
          />
        </Box>
      </div>
    );
  }

  if (step === STEPS.PAID) {
    if (!bookingResponse) {
      toast.error("An error occurred.");
      return <></>;
    }
    title="🎉 Your Tour is Booked 🎉";
    actionLabel="OK";
    bodyContent = (
      <div>
        <Typography variant="body1">✅ Your payment has been successfully processed, and we&apos;re excited to have you join us on the tour.</Typography>
        <Box mt={2}>
          <Typography variant="body1" fontWeight="bold">Booking Details</Typography>
          <LabeledText label="Tour" value={bookingResponse.tourName} />
          <LabeledText label="Location" value={bookingResponse.tourRegion} />
          <LabeledText label="Start Date & Time" value={formatDateAndTime(bookingResponse.startDateTime)} />
          <LabeledText label="Duration" value={`${bookingResponse.tourDuration} ${bookingResponse.tourDuration > 1 ? "days" : "day"}`} />
          <LabeledText label="Number of Participants" value={bookingResponse.numberOfParticipants} />
          <LabeledText label="Total" value={`$${bookingResponse.totalPrice}`} />
        </Box>
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={bookingModal.isOpen}
      title={title}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onModalClose}
      body={bodyContent}
    />
  );
};

export default BookingModal;
