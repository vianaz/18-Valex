import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const formatDate = (date: Date): string => {
  return dayjs(date).format("MM/YY");
};

export const sumYears = (years: number): string => {
  return dayjs().add(years, "year").format("MM/YY");
};

export const isAfterDate = (dateToCompare: Date | string): boolean => {
  return dayjs().isAfter(dayjs(dateToCompare, "MM/YY"));
};
