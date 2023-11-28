import { addDays, format, parse } from "date-fns";
import { Role, nestedFieldErrors } from "../types";
import { Range } from "react-date-range";
import { FieldError } from "react-hook-form";
import _ from "lodash";

export const getMonthFromDateString = (dateString: string): string => {
  const dateObj = new Date(dateString);
  return format(dateObj, "MMM");
};

export const formatDateToYMDString = (date: Date): string => {
  return format(date, "yyyy-MMM-dd");
};

export const formatDateAndTime = (dateString: string): string => {
  const dateObj = new Date(dateString);
  return format(dateObj, "yyyy-MMM-dd(eee) HH:mm");
};

export const formatDateTimeStringToISOString = (
  formattedString: string
): string => {
  // Remove the day of the week from the formatted string
  const cleanedString = formattedString.replace(/\([a-zA-Z]{3}\)/, "");

  const parsedDate = parse(cleanedString, "yyyy-MMM-dd HH:mm", new Date());

  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");
};

export const calculateEndDateFromDuration = (
  startDate: Date,
  duration: number
): Date => {
  return addDays(startDate, duration - 1);
};

export const isDateWithinRange = (
  date: Date,
  filterDateRange: Range
): boolean => {
  let filterStartDate: Date | undefined, filterEndDate: Date | undefined;
  if (filterDateRange.startDate) {
    filterStartDate = new Date(filterDateRange.startDate);
  }
  if (filterDateRange.endDate) {
    filterEndDate = new Date(filterDateRange.endDate);
    filterEndDate.setHours(23, 59, 59, 999);
  }

  if (filterStartDate && date < filterStartDate) {
    return false;
  }
  if (filterEndDate && date > filterEndDate) {
    return false;
  }
  return true;
};

export const roleToLabel = (role: Role): string => {
  switch (role) {
    case Role.Customer:
      return "Customer";
    case Role.Guide:
      return "Guide";
    case Role.LeadGuide:
      return "Lead Guide";
    case Role.Admin:
      return "Admin";
    default:
      throw new Error(`Unexpected role value: ${role}`);
  }
};

export const labelToRole = (label: string): Role => {
  switch (label) {
    case "Customer":
      return Role.Customer;
    case "Guide":
      return Role.Guide;
    case "Lead Guide":
      return Role.LeadGuide;
    case "Admin":
      return Role.Admin;
    default:
      throw new Error(`Unexpected role label: ${label}`);
  }
};

export const labelsToRoles = (labels: string): Role[] => {
  if (_.isEmpty(labels)) {
    return new Array<Role>();
  }

  const labelArray = labels.split(", ");

  return labelArray.map(labelToRole);
};

export const hasObjectAtArrayIndex = (
  dataStructure: any,
  index: number
): boolean => {
  if (typeof dataStructure !== "object" || dataStructure === null) return false;
  for (const key in dataStructure) {
    if (
      !Array.isArray(dataStructure[key]) ||
      typeof dataStructure[key][index] !== "object" ||
      dataStructure[key][index] === null
    )
      return false;
  }
  return true;
};

export const getNestedError = (
  errors: nestedFieldErrors,
  arrayName: string,
  index: number,
  path: string
): FieldError | undefined => {
  const pathSegments = path.split(".");

  if (
    errors[arrayName] &&
    errors[arrayName][index] &&
    errors[arrayName][index][pathSegments[1]]
  ) {
    return errors[arrayName][index][pathSegments[1]][pathSegments[2]];
  }
};
