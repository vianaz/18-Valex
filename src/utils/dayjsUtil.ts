import dayjs from "dayjs";

export const formatDate = (date: Date): string => {
  return dayjs(date).format("MM/YY");
};

export const sumYears = (date: Date, years: number): string => {
  return dayjs(date).add(years, "year").format("MM/YY");
};
