import { axiosInstance } from "../axios";
import axios from "axios";

type UpdateParams = {
  studentsData: { id: string; mark: number | undefined }[];
  classId: string;
  examId: string;
  subjectId: string;
};

export const update = async ({
  studentsData,
  classId,
  examId,
  subjectId,
}: UpdateParams) => {
  try {
    const response = await axiosInstance.post(`/mark`, {
      studentsData,
      classId,
      examId,
      subjectId,
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
