export interface Section {
  section_id: number;
  section_number: string;
  course_id: number;
  course_code: string;
  course_name: string;
  seats_left: number;
  time_conflict: boolean;
  prereq_ok: boolean;
  can_enroll: boolean;
  schedule_str: string;
  teacher_name: string;
  room_name: string;
}

export interface StudentScheduleItem {
  section_id: number;
  course_code: string;
  course_name: string;
  section_number: string;
  teacher_name: string;
  room_name: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface StudentProgress {
  estimatedYears: number;
  credits_earned: number;
  credits_required: number;
  credits_remaining: number;
  gpa: number;
  est_years_to_grad: number;
}

export interface Semester {
  id: number;
  name: string;          // e.g., "Fall 2025"
  year: number;          // e.g., 2025
  order_in_year: number; // 1 = Spring, 2 = Fall, etc.
  start_date: string;    // ISO string, e.g., "2025-09-01"
  end_date: string;      // ISO string
  is_active: boolean;    // true if current semester
}

export interface ApiResponse {
  ok: boolean;
  message?: string;
  [key: string]: any; // optional for extra fields like enrolled_count
}