import axios from 'axios';

import { apiBaseUrl } from '../utils/constants';
import { Tour } from '../types';

const getAllTours = async () => {
  const { data } = await axios.get<Tour[]>(`${apiBaseUrl}/tours`);

  return data;
};

const getAvailableToursWithinRange = async (formattedStartDate: string, formattedEndDate: string) => {
  const { data } = await axios.get<Tour[]>(`${apiBaseUrl}/tours/available?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);

  return data;
}

const getOneTour = async (id: number) => {
  const { data } = await axios.get<Tour | undefined>(`${apiBaseUrl}/tours/${id}`);

  return data;
};

export default { getAllTours, getAvailableToursWithinRange, getOneTour };
