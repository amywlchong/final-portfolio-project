import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/reduxHooks";
import { ScheduleResponse } from "../../types";
import { ApiError } from "../../utils/ApiError";
import { createServiceHandler } from "../../utils/serviceHandler";
import scheduleService from "../../services/scheduleService";

export const useSchedules = () => {
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [errorFetchingSchedules, setErrorFetchingSchedules] =
    useState<ApiError | null>(null);
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const currentUser = useAppSelector((state) => state.user.loggedInUser);

  const fetchSchedules = async () => {
    const getAllSchedulesHandler = createServiceHandler(
      scheduleService.getAllSchedules,
      {
        startLoading: () => setIsLoadingSchedules(true),
        endLoading: () => setIsLoadingSchedules(false),
      },
      { handle: (error: ApiError) => setErrorFetchingSchedules(error) }
    );

    const response = await getAllSchedulesHandler();

    if (response.success && response.data) {
      setSchedules(
        response.data.sort(
          (a, b) =>
            new Date(a.startDateTime).getTime() -
            new Date(b.startDateTime).getTime()
        )
      );
      setErrorFetchingSchedules(null);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentUser]);

  return {
    isLoadingSchedules,
    errorFetchingSchedules,
    schedules,
    fetchSchedules,
    setSchedules,
  };
};
