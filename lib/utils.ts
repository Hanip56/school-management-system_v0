import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_DATE } from "./settings";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateDateBaseOnWeekday = (
  weekdayIndex: number | string,
  time: Date
) => {
  const index: number = +weekdayIndex;

  const baseDate = new Date(BASE_DATE);
  baseDate.setDate(baseDate.getDate() + index);
  const datePart = baseDate.toISOString().split("T")[0];
  const timePart = time.toISOString().split("T")[1];

  return `${datePart}T${timePart}`;
};
