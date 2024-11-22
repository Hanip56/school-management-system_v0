import { StudentWithUser, LessonFull } from "@/types";
import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
  updatedAt?: string;
};

type GetAllResponse = {
  page: number;
  limit: number;
  total_items: number;
  data: LessonFull[];
};

export const getAll = async ({
  page = 1,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/lesson", {
      params: {
        page,
        limit,
        search,
        updatedAt,
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

type UpdateParams = {
  userId: string;
  data: Partial<StudentWithUser>;
};

export const update = async ({ userId, data }: UpdateParams) => {
  try {
    const response = await axiosInstance.put(`/lesson/${userId}`, data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const deleteOne = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/lesson/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
