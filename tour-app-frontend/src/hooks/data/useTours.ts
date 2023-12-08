import { useEffect, useState } from "react";
import tourService from "../../services/tourService";
import { setAllTours } from "../../redux/slices/tourSlice";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import { Tour } from "../../types";

const useTours = () => {
  const [loadingAllTours, setLoadingAllTours] = useState(false);
  const [allToursError, setAllToursError] = useState<ApiError | null>(null);
  const [loadingAvailableTours, setLoadingAvailableTours] = useState(false);
  const [availableToursError, setAvailableToursError] =
    useState<ApiError | null>(null);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);

  const dispatch = useAppDispatch();
  const allTours = useAppSelector((state) => state.tours.allTours);

  const getAllToursHandler = createServiceHandler(
    () => tourService.getAllTours(),
    {
      startLoading: () => setLoadingAllTours(true),
      endLoading: () => setLoadingAllTours(false),
    },
    { handle: (error: ApiError) => setAllToursError(error) }
  );

  const fetchAllTours = async () => {
    const response = await getAllToursHandler();

    if (response.success && response.data) {
      dispatch(setAllTours(response.data));
      setAllToursError(null);
    }
  };

  useEffect(() => {
    if (allTours.length == 0) {
      fetchAllTours();
    }
  }, []);

  const getAvailableToursWithinRangeHandler = createServiceHandler(
    (startDate, endDate) =>
      tourService.getAvailableToursWithinRange(startDate, endDate),
    {
      startLoading: () => setLoadingAvailableTours(true),
      endLoading: () => setLoadingAvailableTours(false),
    },
    { handle: (error: ApiError) => setAvailableToursError(error) }
  );

  const filterTours = async (
    regions: string[],
    startDate: string | null,
    endDate: string | null
  ) => {
    // First, fetch the tours available within the provided date range
    let toursInRange = allTours;

    if (startDate && endDate) {
      const response = await getAvailableToursWithinRangeHandler(
        startDate,
        endDate
      );
      if (response.success && response.data) {
        toursInRange = response.data;
        setAvailableToursError(null);
      }
    }

    // Next, filter the fetched tours based on the selected regions
    const filteredTours =
      regions.length > 0
        ? toursInRange.filter((tour) => regions.includes(tour.region))
        : toursInRange;

    setFilteredTours(filteredTours);
  };

  return {
    loadingAllTours,
    allToursError,
    loadingAvailableTours,
    availableToursError,
    filterTours,
    filteredTours,
  };
};

export default useTours;
