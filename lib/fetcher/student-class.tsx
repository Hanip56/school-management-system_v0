import { StudentClassWithUserAndClasses } from "@/types";
import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
  updatedAt?: string;
  classId?: string;
};

type GetAllResponse = {
  total_items: number;
  data: StudentClassWithUserAndClasses[];
};

export const getAll = async ({
  page = 1,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
  classId,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      `/student-class?classId=${classId}`,
      {
        params: {
          page,
          limit,
          search,
          updatedAt,
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

type CreateParams = {
  classId: string;
  academicYearId: string;
  studentIds: string[];
};

export const create = async ({
  studentIds,
  classId,
  academicYearId,
}: CreateParams) => {
  try {
    const response = await axiosInstance.post(`/student-class`, {
      classId,
      academicYearId,
      studentIds,
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

type CreateMultipleParams = {
  classId: string;
  academicYearId: string;
  studentIds: string[];
};

// bulk assign student
export const createMultiple = async ({
  studentIds,
  classId,
  academicYearId,
}: CreateMultipleParams) => {
  try {
    const response = await axiosInstance.post(`/student-class/multiple`, {
      classId,
      academicYearId,
      studentIds,
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

export const deleteMultiple = async ({ ids }: { ids: string[] }) => {
  try {
    const response = await axiosInstance.post(
      `/student-class/delete-multiple`,
      {
        ids,
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
