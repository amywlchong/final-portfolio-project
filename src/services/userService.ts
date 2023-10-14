import axios from "axios";
import { getAuthHeader } from "./authHeader";
import { Role, User } from "../types";
import { apiBaseUrl } from "../utils/constants";

const getAllUsers = async () => {
  const authHeader = getAuthHeader();
  const { data } = await axios.get<User[]>(`${apiBaseUrl}/users`, authHeader);
  return data;
}

const getAvailableGuidesWithinRange = async (formattedStartDate: string, formattedEndDate: string) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.get<User[]>(`${apiBaseUrl}/users/available-guides?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, authHeader);
  return data;
}

const deleteUser = async (userId: number) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.delete<string>(`${apiBaseUrl}/users/${userId}`, authHeader);
  return data;
}

const updateActive = async (userId: number, newIsActive: boolean) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.put<User>(`${apiBaseUrl}/users/${userId}/active`, {active: newIsActive}, authHeader);
  return data;
}

const updateRole = async (userId: number, newRole: Role) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.put<User>(`${apiBaseUrl}/users/${userId}/role`, {role: newRole}, authHeader);
  return data;
}

export default { getAllUsers, getAvailableGuidesWithinRange, deleteUser, updateActive, updateRole }
