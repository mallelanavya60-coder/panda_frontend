// src/types/models.ts
export interface Semester {
  id: number;
  name: string;
  year: number;
  orderInYear?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface Section {
  sectionId: number;
  courseId?: number;
  courseCode?: string;
  courseName?: string;
  sectionNumber?: number;
  // schedule can contain multiple tokens separated by '|' or ',' (e.g. "Mon 09:00-10:00|Wed 09:00-10:00")
  schedule?: string;
  scheduleStr?: string;
  roomName?: string;
  teacherName?: string;
  capacity?: number;
  seatsLeft?: number;
  prereqsMet?: boolean;   // true if prereq satisfied (mapped from backend)
  timeConflict?: boolean; // backend conflict flag (w.r.t enrolled), client will combine with preview conflicts
  canEnroll?: boolean;    // backend computed
}

export interface StudentScheduleItem {
  sectionId: number;
  courseCode?: string;
  courseName?: string;
  sectionNumber?: number;
  day?: string;
  startTime?: string;
  endTime?: string;
  roomName?: string;
  teacherName?: string;
}

export interface StudentProgress {
  creditsEarned: number;
  creditsRequired: number;
  creditsRemaining: number;
  gpa: number;
  estimatedYears: number;
}
