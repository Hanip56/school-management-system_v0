import { axiosInstance } from "../axios";
import axios from "axios";

export const deleteOne = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);

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
    const response = await axiosInstance.post(`/users/delete-multiple`, {
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
