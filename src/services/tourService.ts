import axios from 'axios';

import { apiBaseUrl } from '../utils/constants';
import { FieldValues, Tour, TourImage, TourRequest } from '../types';
import { getAuthHeader } from './authHeader';

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

const createTour = async (tourRequest: FieldValues<TourRequest>) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.post<Tour>(`${apiBaseUrl}/tours`, tourRequest, authHeader);

  return data;
}

const uploadTourImages = async (tourId: number, images: File[]) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("files", image);
  });

  const imageUrl = `${apiBaseUrl}/tours/${tourId}/images`;
  const authHeader = getAuthHeader();
  const { data } = await axios.post<TourImage[]>(imageUrl, formData, authHeader);

  return data;
}

const updateTour = async (id: number, tourRequest: FieldValues<TourRequest>) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.put<Tour>(`${apiBaseUrl}/tours/${id}`, tourRequest, authHeader);

  return data;
};

const deleteTour = async (id: number) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.delete<string>(`${apiBaseUrl}/tours/${id}`, authHeader);

  return data;
};

const deleteTourImage = async (tourId: number, imageId: number) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.delete<string>(`${apiBaseUrl}/tours/${tourId}/images/${imageId}`, authHeader);

  return data;
};

export default { getAllTours, getAvailableToursWithinRange, getOneTour, createTour, uploadTourImages, updateTour, deleteTour, deleteTourImage };
