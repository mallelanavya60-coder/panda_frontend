import React, { useEffect, useState } from "react";
import { getAvailableSections, getStudentSchedule, enrollInSection, dropSection, getStudentProgress, getSemesters } from "../api/studentApi";
import { CourseList } from "../components/CourseList";
import { Timetable } from "../components/TimeTable";
import { SemesterSelector } from "../components/SemseterSelector";
import { toast } from "react-toastify";
import { Section, StudentScheduleItem, StudentProgress, Semester } from "../types/models";

interface Props {
  studentId: number;
}

export const StudentPlannerPage: React.FC<Props> = ({ studentId }) => {
  const [semesterId, setSemesterId] = useState<number>(1); // default semester
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [schedule, setSchedule] = useState<StudentScheduleItem[]>([]);
  const [progress, setProgress] = useState<StudentProgress>({
    credits_earned: 0,
    credits_required: 30,
    credits_remaining: 30,
    gpa: 0,
    est_years_to_grad: 4,
  });

  const fetchData = async () => {
    try {

      const [sectionsRes, scheduleRes, progressRes, semesterRes] = await Promise.all([
        getAvailableSections(studentId, semesterId).catch(() => ({ ok: false, data: [] })),
        getStudentSchedule(studentId, semesterId).catch(() => ({ ok: false, data: [] })),
        getStudentProgress(studentId).catch(() => ({ ok: false, data: progress })),
        getSemesters().catch(() => ({ ok: false, data: [] })),
      ]);

      setSections(Array.isArray(sectionsRes.data) ? sectionsRes.data : []);
      setSchedule(Array.isArray(scheduleRes.data) ? scheduleRes.data : []);
      setProgress(progressRes.data || progress);
      setSemesters(Array.isArray(semesterRes.data) ? semesterRes.data : []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data from server.");
    }
  };

  useEffect(() => { fetchData(); }, [semesterId]);

  const handleEnroll = async (sectionId: number) => {
  try {
    const res = await enrollInSection(studentId, sectionId, semesterId);
    if (res.ok) {
      toast.success("Enrolled successfully!");
    } else {
      toast.error(res.message || "Enrollment failed.");
    }
    fetchData();
  } catch (err: any) {
    console.error(err);
    toast.error("Enrollment failed.");
  }
};

const handleDrop = async (sectionId: number) => {
  try {
    const res = await dropSection(studentId, sectionId);
    if (res.ok) {
      toast.success("Dropped successfully!");
    } else {
      toast.error(res.message || "Drop failed.");
    }
    fetchData();
  } catch (err: any) {
    console.error(err);
    toast.error("Drop failed.");
  }
};


  return (
    <div>
      <h2>Course Planner</h2>

      {/* Semester selector */}
      <SemesterSelector
        semesters={semesters}
        selectedSemesterId={semesterId}
        onChange={setSemesterId}
      />

      <CourseList sections={sections} onEnroll={handleEnroll} />

      <h3>My Schedule</h3>
      <Timetable schedule={schedule} onDrop={handleDrop} />

      <h3>Progress</h3>
      <div>
        <p>Credits Earned: {progress.credits_earned}</p>
        <p>Credits Remaining: {progress.credits_remaining}</p>
        <p>GPA: {progress.gpa.toFixed(2)}</p>
        <p>Estimated Years to Graduate: {progress.est_years_to_grad}</p>
      </div>
    </div>
  );
};

export default StudentPlannerPage;