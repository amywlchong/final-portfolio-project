import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/reduxHooks";
import { BookingResponse } from "../../types";
import { ApiError } from "../../utils/ApiError";
import { createServiceHandler } from "../../utils/serviceHandler";

export const useBookings = (bookingServiceFunction: () => Promise<BookingResponse[]>) => {
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [errorFetchingBookings, setErrorFetchingBookings] = useState<ApiError | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [pastBookings, setPastBookings] = useState<BookingResponse[]>([]);
  const [futureBookings, setFutureBookings] = useState<BookingResponse[]>([]);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const fetchBookings = async () => {
    if (!currentUser) return;

    const getBookingsHandler = createServiceHandler(bookingServiceFunction, {
      startLoading: () => setIsLoadingBookings(true),
      endLoading: () => setIsLoadingBookings(false),
    }, { handle: (error: ApiError) => setErrorFetchingBookings(error) });

    const response = await getBookingsHandler();
    if (response.success && response.data) {
      setBookings(response.data);
      setErrorFetchingBookings(null);

      const pastBookings = response.data
        .filter(booking => new Date(booking.startDateTime).getTime() < new Date().getTime())
        .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());
      const futureBookings = response.data
        .filter(booking => new Date(booking.startDateTime).getTime() >= new Date().getTime())
        .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
      setPastBookings(pastBookings);
      setFutureBookings(futureBookings);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  return {
    isLoadingBookings,
    errorFetchingBookings,
    bookings,
    futureBookings,
    pastBookings,
    fetchBookings,
    setFutureBookings,
    setPastBookings
  };
};
