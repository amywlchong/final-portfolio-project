export interface FieldValues<T = any> {
  [x: string]: T;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  active: boolean;
  role: Role;
}

export enum Role {
  Customer = "ROLE_CUSTOMER",
  Guide = "ROLE_GUIDE",
  LeadGuide = "ROLE_LEAD_GUIDE",
  Admin = "ROLE_ADMIN"
}
