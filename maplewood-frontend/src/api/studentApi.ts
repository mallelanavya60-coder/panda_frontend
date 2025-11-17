import axios from "axios";
import { Section, StudentScheduleItem, StudentProgress, ApiResponse, Semester } from "../types/models";

const API_BASE = "/api/student";

export const getAvailableSections = (studentId: number, semesterId: number) =>
  axios.get<Section[]>(`${API_BASE}/${studentId}/available-sections`, { params: { semesterId } });

export const getStudentSchedule = (studentId: number, semesterId: number) =>
  axios.get<StudentScheduleItem[]>(`${API_BASE}/${studentId}/schedule`, { params: { semesterId } });

export const enrollInSection = async (studentId: number, sectionId: number, semesterId: number): Promise<ApiResponse> => {
  const res = await axios.post(`${API_BASE}/${studentId}/enroll`, { sectionId, semesterId });
  return res.data as ApiResponse;
};

export const dropSection = async (studentId: number, sectionId: number): Promise<ApiResponse> => {
  const res = await axios.post(`${API_BASE}/${studentId}/drop`, { sectionId });
  return res.data as ApiResponse;
};
export const getStudentProgress = (studentId: number) =>
  axios.get<StudentProgress>(`${API_BASE}/${studentId}/progress`);

export interface EnrollResponse {
  status: string;
  message: string;
}

export const getSemesters = async (): Promise<{ ok: boolean; data: Semester[] }> => {
  try {
    // Tell TypeScript the response is Semester[]
    const res = await axios.get<Semester[]>(`${API_BASE}/semesters`);
    return { ok: true, data: res.data };
  } catch (err) {
    console.error(err);
    return { ok: false, data: [] };
  }
};
