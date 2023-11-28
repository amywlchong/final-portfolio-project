import axios from "axios";

import { apiBaseUrl } from "../config/constants";
import { BookingRequest, BookingResponse } from "../types";
import { getAuthHeader } from "./authHeader";

const getAllBookings = async () => {
  const authHeader = getAuthHeader();
  const { data } = await axios.get<BookingResponse[]>(
    `${apiBaseUrl}/bookings`,
    authHeader
  );
  return data;
};

const getMyBookings = async () => {
  const authHeader = getAuthHeader();
  const { data } = await axios.get<BookingResponse[]>(
    `${apiBaseUrl}/me/bookings`,
    authHeader
  );
  return data;
};

const createBooking = async (bookingRequest: BookingRequest) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.post<BookingResponse>(
    `${apiBaseUrl}/bookings`,
    bookingRequest,
    authHeader
  );
  return data;
};

const updateBooking = async (
  bookingId: number,
  bookingRequest: BookingRequest
) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.put<BookingResponse>(
    `${apiBaseUrl}/bookings/${bookingId}`,
    bookingRequest,
    authHeader
  );
  return data;
};

const deleteBooking = async (bookingId: number) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.delete<string>(
    `${apiBaseUrl}/bookings/${bookingId}`,
    authHeader
  );
  return data;
};

export default {
  getAllBookings,
  getMyBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};
