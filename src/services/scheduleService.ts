import axios from "axios";
import { getAuthHeader } from "./authHeader";
import { ScheduleRequest, ScheduleResponse } from "../types";
import { apiBaseUrl } from "../config/constants";

const getAllSchedules = async () => {
  const authHeader = getAuthHeader();
  const { data } = await axios.get<ScheduleResponse[]>(`${apiBaseUrl}/tour-guide-schedules`, authHeader);
  return data;
};

const createSchedule = async (scheduleRequest: ScheduleRequest) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.post<ScheduleResponse>(`${apiBaseUrl}/tour-guide-schedules`, scheduleRequest, authHeader);
  return data;
};

const deleteSchedule = async (scheduleId: number) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.delete<string>(`${apiBaseUrl}/tour-guide-schedules/${scheduleId}`, authHeader);
  return data;
};

export default { getAllSchedules, createSchedule, deleteSchedule };
