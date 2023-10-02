import axios from 'axios';

import { apiBaseUrl } from '../utils/constants';
import { FieldValues, LoginFormValues, RegisterFormValues, User } from '../types';

const register = async (object: FieldValues<RegisterFormValues>) => {
  const { data } = await axios.post(
    `${apiBaseUrl}/auth/register`,
    object
  );

  if (!data) {
    throw new Error("Received no data or undefined from the server.");
  }
  if (!data.token) {
    throw new Error("Token not provided in register response.")
  }
  if (!data.userId || !data.userName || data.userActive === undefined || !data.userRole) {
    throw new Error("User fields missing in register response.")
  }

  const token: string = data.token;
  const user: User = {
    id: data.userId,
    name: data.userName,
    active: data.userActive,
    role: data.userRole
  }

  return { token, user };
};

const login = async (object: FieldValues<LoginFormValues>) => {
  const { data } = await axios.post(
    `${apiBaseUrl}/auth/authenticate`,
    object
  );

  if (!data) {
    throw new Error("Received no data or undefined from the server.");
  }
  if (!data.token) {
    throw new Error("Token not provided in login response.")
  }
  if (!data.userId || !data.userName || data.userActive === undefined || !data.userRole) {
    throw new Error("User fields missing in login response.")
  }

  const token: string = data.token;
  const user: User = {
    id: data.userId,
    name: data.userName,
    active: data.userActive,
    role: data.userRole
  }

  return { token, user };
};

export default {
  register,
  login
};
