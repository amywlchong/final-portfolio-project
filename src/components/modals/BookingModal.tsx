import { useAppSelector } from '../../app/reduxHooks';
import Modal from "./Modal";
import BigNumber from 'bignumber.js';
import { Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BookingRequest, BookingResponse, FieldValues } from "../../types";
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import bookingService from '../../services/bookingService';
import { convertToISOlikeFormat, formatDateAndTime } from '../../utils/dataProcessing';
import { useCallback, useEffect, useState } from 'react';
import paymentService from '../../services/paymentService';
import { FUNDING, PayPalButtons } from '@paypal/react-paypal-js';
import useBookingModal from '../../hooks/useBookingModal';
import { createServiceHandler } from '../../utils/serviceHandler';
import { ApiError } from '../../utils/ApiError';

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
      toast("Please log in or sign up to continue", { icon: '❗' });
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
  }

  const startLoading = () => setIsLoading(true);
  const endLoading = () => setIsLoading(false);

  const createBookingHandler = createServiceHandler(
    bookingService.createBooking,
    { startLoading, endLoading },
    {
      handle: (error: ApiError) => {
        if (error.response?.data.includes("Duplicate entry")) {
          toast.error("You've already booked this tour for the selected date.")
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
        startDateTime: convertToISOlikeFormat(startDateTime),
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
        <Typography variant="body1">Tour: {tour.name}</Typography>
        <Typography variant="body1">Location: {tour.region}</Typography>
        <Typography variant="body1">Start Date & Time: {startDateTime}</Typography>
        <Typography variant="body1">Duration: {`${tour.duration} ${tour.duration > 1 ? 'days' : 'day'}`}</Typography>
        <label>
          <Input
            id="participants"
            label="Number of Participants"
            type="number"
            disabled={isLoading}
            min={1}
            max={availableSpaces}
            register={register}
            errors={errors}
            required
          />
        </label>
        <Typography variant="body1">Price: ${tour.price} per person</Typography>
        <Typography variant="body1">Total: ${(new BigNumber(tour.price)).times(watchedParticipants).toString()}</Typography>
      </div>
    )
  }

  if (step === STEPS.PAY) {
    if (!bookingResponse) {
      return <div>An error occurred.</div>
    }
    title="Complete Payment";
    bodyContent = (
      <div>
        <Typography variant="body1" fontWeight="bold">You will be redirected to PayPal to complete your payment securely.</Typography>
        <Typography variant="body1">Tour: {bookingResponse.tourName}</Typography>
        <Typography variant="body1">Price: ${bookingResponse.unitPrice} per person</Typography>
        <Typography variant="body1">Total: ${bookingResponse.totalPrice}</Typography>
        <Box mt={2}>
          <Typography variant="body2">Booking & Payment Policy</Typography>
          <Typography variant="body2" fontSize="0.8rem">Thank you for choosing to book a tour with us. Please note the following important guidelines regarding bookings and payments:</Typography>
          <Typography variant="body2" fontSize="0.8rem">Immediate Payment: Please proceed to make an immediate payment via PayPal to complete the booking process.</Typography>
          <Typography variant="body2" fontSize="0.8rem">No Reservations without Payment: We cannot reserve places on the tour without receiving full payment. Your spots are only confirmed once the payment is successfully made.</Typography>
          <Typography variant="body2" fontSize="0.8rem">Non-cancellable & Non-refundable: Once paid for, all bookings are non-cancellable and non-refundable.</Typography>
          <Typography variant="body2" fontSize="0.8rem">We appreciate your understanding and cooperation. This policy ensures fairness to all our guests and helps us maintain the quality of our tours.</Typography>
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
    )
  }

  if (step === STEPS.PAID) {
    if (!bookingResponse) {
      return <div>An error occurred.</div>
    }
    title="🎉 Your Tour is Booked 🎉";
    actionLabel="OK";
    bodyContent = (
      <div>
        <Typography variant="body1">✅ Your payment has been successfully processed, and we&apos;re excited to have you join us on the tour.</Typography>
        <Box mt={2}>
          <Typography variant="body1" fontWeight="bold">Booking Details:</Typography>
          <Typography variant="body1">Tour: {bookingResponse.tourName}</Typography>
          <Typography variant="body1">Location: {bookingResponse.tourRegion}</Typography>
          <Typography variant="body1">Start Date & Time: {formatDateAndTime(bookingResponse.startDateTime)}</Typography>
          <Typography variant="body1">Duration: {`${bookingResponse.tourDuration} ${bookingResponse.tourDuration > 1 ? 'days' : 'day'}`}</Typography>
          <Typography variant="body1">Number of Participants: {bookingResponse.numberOfParticipants}</Typography>
          <Typography variant="body1">Total: ${bookingResponse.totalPrice}</Typography>
        </Box>
      </div>
    )
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={bookingModal.isOpen}
      title={title}
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      onClose={onModalClose}
      body={bodyContent}
    />
  );
}

export default BookingModal;
