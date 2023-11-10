import { subMonths } from "date-fns";
import { BookingResponse } from "../types";
import { getMonthFromDateString } from "./dataProcessing";

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export interface numOfBookingsByProperty<T extends string | number | Date> {
  [key: string]: string | number | Date;
  property: T;
  numberOfBookings: number;
}

export const getNumOfBookingsByProperty = <T extends string | number | Date>(
  bookings: BookingResponse[],
  groupByKey: (booking: BookingResponse) => T
): numOfBookingsByProperty<T>[] => {
  return bookings.reduce<numOfBookingsByProperty<T>[]>(
    (prev, current) => {
      const keyValue = groupByKey(current);
      const existingEntryIndex = prev.findIndex(entry => entry.property === keyValue);

      if (existingEntryIndex !== -1) {
        prev[existingEntryIndex].numberOfBookings += 1;
      } else {
        keyValue != null && prev.push({ property: keyValue, numberOfBookings: 1 });
      }

      return prev;
    },
    []
  );
};

export const getLastSixMonthsBookings = (bookings: BookingResponse[]): BookingResponse[] => {
  const sixMonthsAgo = subMonths(new Date(), 6);

  return bookings
    .filter(booking => {
      const bookingDate = new Date(booking.startDateTime);
      const bookingMonth = bookingDate.getMonth();
      const bookingYear = bookingDate.getFullYear();
      return (
        (bookingYear === currentYear && bookingMonth === currentMonth) || // Current month bookings
        (bookingDate >= sixMonthsAgo && bookingDate < new Date()) // Last six months bookings
      );
    })
    .map(booking => {
      return { ...booking, monthOfStartDate: getMonthFromDateString(booking.startDateTime) };
    })
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
};

export const getBookingsThisMonth = (bookings: BookingResponse[]): BookingResponse[] => {
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.startDateTime);
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
  });
};
