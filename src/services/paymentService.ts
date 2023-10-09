import axios from 'axios';

import { apiBaseUrl } from '../utils/constants';
import { CapturePaymentRequest, CapturePaymentResponse } from '../types';
import { getAuthHeader } from './authHeader';

const initiatePayment = async (bookingId: number) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.post<string>(`${apiBaseUrl}/payments/initiate`, { bookingId }, authHeader);
  return data;
};

const capturePayment = async ( capturePaymentRequest: CapturePaymentRequest ) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.post<CapturePaymentResponse>(`${apiBaseUrl}/payments/execute`, capturePaymentRequest, authHeader);
  return data;
}

export default { initiatePayment, capturePayment };
