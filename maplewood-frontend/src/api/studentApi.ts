// src/api/studentApi.ts
import { Semester, Section, StudentScheduleItem, StudentProgress } from "../types/models";

async function fetchJson(path: string, opts?: RequestInit) {
  const res = await fetch(path, opts);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function getSemesters(): Promise<Semester[]> {
  const raw = await fetchJson(`/api/student/semesters`);
  return (raw || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    year: r.year,
    orderInYear: r.order_in_year ?? r.orderInYear ?? 0,
    startDate: r.start_date ?? r.startDate,
    endDate: r.end_date ?? r.endDate,
    isActive: r.is_active === 1 || r.is_active === true || !!r.isActive
  }));
}

export async function getAvailableSections(studentId: number, semesterId: number): Promise<Section[]> {
  const raw = await fetchJson(`/api/student/${studentId}/available-sections?semesterId=${semesterId}`);
  return (raw || []).map((r: any) => ({
    sectionId: r.id ?? r.section_id ?? 0,
    courseId: r.course_id,
    courseCode: r.course_code ?? r.courseCode,
    courseName: r.course_name ?? r.courseName,
    sectionNumber: r.section_number ?? r.sectionNumber,
    schedule: r.schedule ?? r.schedule_str ?? (r.day && r.start_time && r.end_time ? `${r.day} ${r.start_time}-${r.end_time}` : "TBA"),
    scheduleStr: r.schedule_str ?? undefined,
    roomName: r.room_name ?? r.room ?? undefined,
    teacherName: r.teacher_name ?? r.teacher ?? undefined,
    capacity: r.capacity,
    seatsLeft: r.seatsLeft ?? r.seats_left ?? r.seats_left ?? undefined,
    prereqsMet: (r.prereq_ok ?? r.prereqOk) === undefined ? true : !!(r.prereq_ok ?? r.prereqOk),
    timeConflict: !!(r.time_conflict ?? r.timeConflict),
    canEnroll: !!(r.can_enroll ?? r.canEnroll)
  }));
}

export async function getStudentSchedule(studentId: number, semesterId: number): Promise<StudentScheduleItem[]> {
  const raw = await fetchJson(`/api/student/${studentId}/schedule?semesterId=${semesterId}`);
  return (raw || []).map((r: any) => ({
    sectionId: r.section_id ?? r.sectionId,
    courseCode: r.course_code ?? r.courseCode,
    courseName: r.course_name ?? r.courseName,
    sectionNumber: r.section_number ?? r.sectionNumber,
    day: r.day,
    startTime: r.start_time ?? r.startTime,
    endTime: r.end_time ?? r.endTime,
    roomName: r.room_name ?? r.roomName,
    teacherName: r.teacher_name ?? r.teacherName
  }));
}

export async function getStudentProgress(studentId: number): Promise<StudentProgress> {
  const raw = await fetchJson(`/api/student/${studentId}/progress`);
  return {
    creditsEarned: raw.creditsEarned ?? raw.credits_earned ?? 0,
    creditsRequired: raw.requiredCredits ?? raw.required_credits ?? 30,
    creditsRemaining: raw.creditsRemaining ?? raw.remaining ?? Math.max(0, (raw.requiredCredits ?? 30) - (raw.creditsEarned ?? 0)),
    gpa: raw.gpa ?? raw.passFailRatio ?? 0,
    estimatedYears: raw.estYearsToGraduate ?? raw.est_years ?? raw.estYears ?? 0
  };
}

export async function enrollInSection(studentId: number, sectionId: number, semesterId: number) {
  return fetchJson(`/api/student/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, sectionId, semesterId })
  });
}

export async function dropSection(studentId: number, sectionId: number) {
  return fetchJson(`/api/student/drop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, sectionId })
  });
}
