import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";
import { FeeStructureWithCategory } from "@/types";

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
  data: FeeStructureWithCategory[];
};

export const getAll = async ({
  page = 1,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
  classId,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/fee", {
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
  data: Partial<FeeStructureWithCategory>;
};

export const update = async ({ id, data }: UpdateParams) => {
  try {
    const response = await axiosInstance.put(`/fee/${id}`, data);

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
    const response = await axiosInstance.delete(`/fee/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
