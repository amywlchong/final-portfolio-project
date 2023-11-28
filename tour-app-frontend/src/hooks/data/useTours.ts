import { useEffect, useState } from "react";
import tourService from "../../services/tourService";
import { setAllTours, setFilteredTours } from "../../redux/slices/tourSlice";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";

const useTours = () => {
  const [loadingAllTours, setLoadingAllTours] = useState(false);
  const [loadingAvailableTours, setLoadingAvailableTours] = useState(false);

  const [allToursError, setAllToursError] = useState<ApiError | null>(null);
  const [availableToursError, setAvailableToursError] =
    useState<ApiError | null>(null);

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
    regions: string | (string | null)[] | null,
    startDate: string | (string | null)[] | null,
    endDate: string | (string | null)[] | null
  ) => {
    // First, fetch the tours available within the provided date range
    let toursInRange = allTours;
    if (typeof startDate == "string" && typeof endDate == "string") {
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
      Array.isArray(regions) && regions.length > 0
        ? toursInRange.filter((tour) => regions.includes(tour.region))
        : toursInRange;

    dispatch(setFilteredTours(filteredTours));
  };

  return {
    loadingAllTours,
    allToursError,
    loadingAvailableTours,
    availableToursError,
    filterTours,
  };
};

export default useTours;
