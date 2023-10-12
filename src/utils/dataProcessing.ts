import { format, parse } from 'date-fns';
import { Role } from '../types';

export const formatDateAndTime = (dateString: string): string => {
  const dateObj = new Date(dateString);
  return format(dateObj, "yyyy-MM-dd(eee) HH:mm");
};

export const convertToISOlikeFormat = (formattedString: string): string => {
  // Remove the day of the week from the formatted string
  const cleanedString = formattedString.replace(/\([a-zA-Z]{3}\)/, '');

  const parsedDate = parse(cleanedString, "yyyy-MM-dd HH:mm", new Date());

  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");
};

export const getCurrentDateTimeInISOlikeFormat = (): string => {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
}

export const roleToLabel = (role: Role): string => {
  switch (role) {
    case Role.Customer:
      return 'Customer';
    case Role.Guide:
      return 'Guide';
    case Role.LeadGuide:
      return 'Lead Guide';
    case Role.Admin:
      return 'Admin';
    default:
      throw new Error(`Unexpected role value: ${role}`);
  }
}

export const labelToRole = (label: string): Role => {
  switch (label) {
    case 'Customer':
      return Role.Customer;
    case 'Guide':
      return Role.Guide;
    case 'Lead Guide':
      return Role.LeadGuide;
    case 'Admin':
      return Role.Admin;
    default:
      throw new Error(`Unexpected role label: ${label}`);
  }
}
