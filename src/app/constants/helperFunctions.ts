import { isAfter, isEqual, parseISO } from "date-fns";
import { IExam } from "../types/exams";

export const generateRandomId = (): string => {
  return `radio-${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidDateRange = (start: string, end: string): boolean | null => {
  if (start.length > 0 && end.length > 0) {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    return isAfter(endDate, startDate) || isEqual(endDate, startDate);
  } else {
    return null;
  }
};

export const examPrice = (exam: IExam) => {
  if (exam.institutionExam) {
    if (exam.institutionExam[0]) {
      return exam.institutionExam[0].price;
    }
  }

  return exam.price;
};
