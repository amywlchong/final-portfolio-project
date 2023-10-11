import axios from 'axios';

import { apiBaseUrl } from '../utils/constants';
import { FieldValues, LoginFormValues, RegisterFormValues, UpdatePasswordValues, User } from '../types';
import { getAuthHeader } from './authHeader';

const extractTokenAndUser = (data: any): { token: string, user: User } => {
  if (!data) {
    throw new Error("Received no data or undefined from the server.");
  }
  if (!data.token) {
    throw new Error("Token not provided in response.")
  }
  if (!data.userId || !data.userName || data.userActive === undefined || !data.userRole) {
    throw new Error("User fields missing in response.")
  }

  const token: string = data.token;
  const user: User = {
    id: data.userId,
    name: data.userName,
    active: data.userActive,
    role: data.userRole
  }

  return { token, user };
}

const register = async (registerRequest: FieldValues<RegisterFormValues>) => {
  const { data } = await axios.post(`${apiBaseUrl}/auth/register`, registerRequest);
  return extractTokenAndUser(data);
};

const login = async (loginRequest: FieldValues<LoginFormValues>) => {
  const { data } = await axios.post(`${apiBaseUrl}/auth/authenticate`, loginRequest);
  return extractTokenAndUser(data);
};

const updatePassword = async (updatePasswordRequest: FieldValues<UpdatePasswordValues>) => {
  const authHeader = getAuthHeader();
  const { data } = await axios.put(`${apiBaseUrl}/auth/update-my-password`, updatePasswordRequest, authHeader);
  return extractTokenAndUser(data);
}

const deactivateAccount = async () => {
  const authHeader = getAuthHeader();
  const { data } = await axios.put<User>(`${apiBaseUrl}/me/active`, {active: false}, authHeader);
  return data;
}

export default {
  register,
  login,
  updatePassword,
  deactivateAccount
};
