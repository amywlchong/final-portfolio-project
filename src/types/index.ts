import bigDecimal from "js-big-decimal";

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

export interface Tour {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: Difficulty;
  price: bigDecimal;
  summary: string;
  description?: string;
  region: string;
  startAddress: string;
  createdDate: Date;
  ratingsCount: number;
  ratingsAverage?: number;
  tourImages?: TourImage[];
  tourPointsOfInterest?: TourPointOfInterest[];
  tourStartDates?: TourStartDate[];
}

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Difficult = "difficult"
}

export interface TourImage {
  imageId: number;
  imageName: string;
  imagePath: string;
  coverImage: boolean;
}

export interface TourPointOfInterest {
  id: number;
  pointOfInterest: PointOfInterest;
  day?: number;
}

export interface PointOfInterest {
  id: number;
  name: string;
  description: string;
}

export interface TourStartDate {
  id: TourStartDateKey;
  availableSpaces?: number;
  startDate: StartDate;
}

export interface TourStartDateKey {
  tourId: number;
  startDateId: number;
}

export interface StartDate {
  id: number;
  startDateTime: Date;
}
