import { format, parse } from 'date-fns';

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
