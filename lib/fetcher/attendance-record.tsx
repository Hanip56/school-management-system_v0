import { AttendanceStatus } from "@prisma/client";
import { axiosInstance } from "../axios";
import axios from "axios";

type UpdateParams = {
  studentsData: { id: string; status: AttendanceStatus }[];
  classId: string;
  date: string;
};

export const update = async ({ studentsData, classId, date }: UpdateParams) => {
  try {
    const response = await axiosInstance.post(`/attendance-record`, {
      studentsData,
      classId,
      date,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
