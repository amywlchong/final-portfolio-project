import { JwtPayload } from "jwt-decode";
import { FieldError } from "react-hook-form";

export interface FieldValues<T = any> {
  [x: string]: T;
}

export interface nestedFieldErrors {
  [x: string]: Array<{
    [y: string]: {
      [z: string]: FieldError | undefined;
    }
  }>
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

export interface UpdatePasswordValues {
  oldPassword: string;
  newPassword: string;
}

export interface AdminBookingFormValues {
  participants: number;
  user: User | null;
  tourName: string | null;
  tour: Tour | null;
  tourStartDate: TourStartDate | null;
}

export interface CustomJwtPayload extends JwtPayload {
  userId: number;
  userName: string;
  userActive: boolean;
  userRole: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email?: string;
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
  price: string;
  summary: string;
  description?: string;
  region: string;
  startAddress: string;
  createdDate: string;
  ratingsCount: number;
  ratingsAverage?: number;
  tourImages?: TourImage[];
  tourPointsOfInterest?: TourPointOfInterest[];
  tourStartDates?: TourStartDate[];
}

export type TourRequest = Omit<Tour, 'id' | 'createdDate' | 'ratingsCount'>;

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
  startDateTime: string;
}

export interface BookingRequest {
  userId: number;
  tourId: number;
  startDateTime: string;
  numberOfParticipants: number;
}

export interface BookingResponse {
  id: number;
  unitPrice: string;
  totalPrice: string;
  paid: boolean;
  transactionId?: string;
  numberOfParticipants: number;
  createdDate: string;

  // User fields
  userId: number;
  userName: string;
  userActive: boolean;
  userRole: Role;

  // Tour fields
  tourId: number;
  tourName: string;
  tourDuration: number;
  tourRegion: string;

  // StartDate fields
  startDateId: number;
  startDateTime: string;
}

export interface CapturePaymentRequest {
  bookingId: number;
  orderId: string;
}

export interface CapturePaymentResponse {
  amount: {
    value: string;
    currency_code: string;
  };
  orderId: string;
  referenceId: string;
  transactionId: string;
  status: string;
}

export interface ReviewRequest {
  bookingId: number;
  rating: number;
  review: string;
}

export interface ReviewResponse {
  id: number;
  review: string;
  rating: number;
  createdDate: string;

  // Booking field
  bookingId: number;

  // User fields
  userId: number;
  userName: string;
  userActive: boolean;
  userRole: Role;

  // Tour fields
  tourId: number;
  tourName: string;
  tourDuration: number;
  tourRegion: string;

  // StartDate fields
  startDateId: number;
  startDateTime: string;
}

export interface ScheduleRequest {
  userId: number;
  tourId: number;
  startDateTime: string;
}

export interface ScheduleResponse {
  id?: number;

  // User fields
  userId?: number;
  userName?: string;
  userActive?: boolean;
  userRole?: Role;

  // Tour fields
  tourId: number;
  tourName: string;
  tourDuration: number;
  tourRegion: string;

  // StartDate fields
  startDateId: number;
  startDateTime: string;
}
