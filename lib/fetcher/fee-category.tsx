import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";
import { ExamWithClass } from "@/types";
import { FeeCategory } from "@prisma/client";

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
  data: FeeCategory[];
};

export const getAll = async ({
  page = 1,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/fee-category", {
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
  id: string;
  data: Partial<ExamWithClass>;
};

export const update = async ({ id, data }: UpdateParams) => {
  try {
    const response = await axiosInstance.put(`/fee-category/${id}`, data);

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
    const response = await axiosInstance.delete(`/fee-category/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
