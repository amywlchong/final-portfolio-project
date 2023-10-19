import axios from 'axios';
import jwtDecode from "jwt-decode";

import { apiBaseUrl } from '../utils/constants';
import { CustomJwtPayload, FieldValues, LoginFormValues, RegisterFormValues, UpdatePasswordValues, User } from '../types';
import { getAuthHeader } from './authHeader';

export const extractTokenAndUser = (data: any): { token: string, user: User } => {
  if (!data) {
    throw new Error("Null or undefined data.");
  }
  if (!data.token) {
    throw new Error("Token not provided.");
  }

  const decoded = jwtDecode<CustomJwtPayload>(data.token);

  const token: string = data.token;
  const user: User = {
    id: decoded.userId,
    name: decoded.userName,
    active: decoded.userActive,
    role: decoded.userRole
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
