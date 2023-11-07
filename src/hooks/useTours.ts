import { useEffect, useState } from "react";
import { Tour } from "../types";
import tourService from "../services/tourService";
import { setAllTours, setFilteredTours } from "../redux/slices/tourSlice";
import { useAppDispatch, useAppSelector } from "../app/reduxHooks";
import { createServiceHandler } from "../utils/serviceHandler";
import { ApiError } from "../utils/ApiError";

const useTours = () => {
  const [loadingAllTours, setLoadingAllTours] = useState(false);
  const [loadingAvailableTours, setLoadingAvailableTours] = useState(false);

  const [allToursError, setAllToursError] = useState<ApiError | null>(null);
  const [availableToursError, setAvailableToursError] = useState<ApiError | null>(null);

  const dispatch = useAppDispatch();
  const allTours = useAppSelector(state => state.tours.allTours);

  const getAllTours = createServiceHandler(
    () => tourService.getAllTours(),
    {
      startLoading: () => setLoadingAllTours(true),
      endLoading: () => setLoadingAllTours(false),
    },
    {
      handle: (error: ApiError) => setAllToursError(error)
    }
  );

  useEffect(() => {
    const fetchAllTours = async () => {
      const response = await getAllTours();

      if (response.success && response.data) {
        dispatch(setAllTours(response.data));
        setAllToursError(null);
      }
    };

    if (allTours.length == 0) {
      fetchAllTours();
    }
  }, []);

  const getAvailableToursWithinRange = createServiceHandler(
    (startDate, endDate) => tourService.getAvailableToursWithinRange(startDate, endDate),
    {
      startLoading: () => setLoadingAvailableTours(true),
      endLoading: () => setLoadingAvailableTours(false),
    },
    {
      handle: (error: ApiError) => setAvailableToursError(error)
    }
  );

  const filterTours = async (regions: string | (string | null)[] | null, startDate: string | (string | null)[] | null, endDate: string | (string | null)[] | null) => {
    // First, fetch the tours available within the provided date range
    let toursInRange: Tour[] = [];
    if (typeof startDate == "string" && typeof endDate == "string") {
      const response = await getAvailableToursWithinRange(startDate, endDate);
      if (response.success && response.data) {
        toursInRange = response.data;
        setAvailableToursError(null);
      }
    } else {
      toursInRange = allTours;
    }

    // Next, filter the fetched tours based on the selected regions
    if (Array.isArray(regions) && regions.length > 0) {
      const filteredTours: Tour[] = toursInRange.filter(tour => regions.includes(tour.region));
      dispatch(setFilteredTours(filteredTours));
    } else {
      dispatch(setFilteredTours(toursInRange));
    }
  };

  return { getAllTours, loadingAllTours, allToursError, filterTours, loadingAvailableTours, availableToursError };
};

export default useTours;
