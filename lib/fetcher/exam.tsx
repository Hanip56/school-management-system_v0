import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";
import { ExamWithClass } from "@/types";

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
  data: ExamWithClass[];
};

export const getAll = async ({
  page = 1,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
  classId,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/exam", {
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

type UpdateParams = {
  id: string;
  data: Partial<ExamWithClass>;
};

export const update = async ({ id, data }: UpdateParams) => {
  try {
    const response = await axiosInstance.put(`/exam/${id}`, data);

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
    const response = await axiosInstance.delete(`/exam/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
