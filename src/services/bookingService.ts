import axios from 'axios';

import { apiBaseUrl } from '../utils/constants';
import { BookingRequest, BookingResponse } from '../types';
import { getAuthHeader } from './authHeader';

const getMyBookings = async () => {
  const authHeader = getAuthHeader();
  const { data } = await axios.get<BookingResponse[]>(`${apiBaseUrl}/me/bookings`, authHeader);
  return data;
}

const createBooking = async (bookingRequest: BookingRequest) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.post<BookingResponse>(`${apiBaseUrl}/bookings`, bookingRequest, authHeader);
  return data;
};

const updateBooking = async (bookingId: number, bookingRequest: BookingRequest) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.put<BookingResponse>(`${apiBaseUrl}/bookings/${bookingId}`, bookingRequest, authHeader);
  return data;
}

export default { getMyBookings, createBooking, updateBooking };
