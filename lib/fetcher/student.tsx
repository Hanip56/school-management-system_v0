import {
  StudentWithAttendance,
  StudentWithUser,
  StudentWithUserAndClasses,
} from "@/types";
import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";

type GetAllParams = {
  page?: number;
  limit?: number;
  classId: string;
  search?: string;
  updatedAt?: string;
};

type GetAllResponse = {
  page: number;
  limit: number;
  total_items: number;
  data: StudentWithUserAndClasses[];
};

export const getAll = async ({
  page = 1,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
  classId,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/students", {
      params: {
        page,
        limit,
        search,
        updatedAt,
        classId,
      },
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

type GetStudentWithAttendanceParams = {
  classId: string;
  date: string;
};

type GetStudentWithAttendanceResponse = {
  data: StudentWithAttendance[];
};

export const getStudentWithAttendance = async ({
  classId,
  date,
}: GetStudentWithAttendanceParams) => {
  try {
    const response = await axiosInstance.get<GetStudentWithAttendanceResponse>(
      "/students/attendance",
      {
        params: {
          classId,
          date,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

type UpdateParams = {
  userId: string;
  data: Partial<StudentWithUser>;
};

export const update = async ({ userId, data }: UpdateParams) => {
  try {
    const response = await axiosInstance.put(`/students/${userId}`, data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

type DeleteMultipleParams = {
  ids: string[];
};

export const deleteMultiple = async ({ ids }: DeleteMultipleParams) => {
  try {
    const response = await axiosInstance.post(`/students/delete-multiple`, {
      ids,
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
