// src/Pages/StudentPlannerPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { getSemesters, getAvailableSections, getStudentSchedule, getStudentProgress, enrollInSection, dropSection } from "../api/studentApi";
import { Semester, Section, StudentScheduleItem, StudentProgress } from "../types/models";
import SectionCard from "../components/SectionCard";
import Timetable from "../components/TimeTable";
import SemesterSelector from "../components/SemseterSelector";

interface Props {
  studentId: number;
}

function parseScheduleTokens(schedule?: string): string[] {
  if (!schedule) return [];
  // support '|' or ',' or ';' separators
  return schedule.split(/[|,;]+/).map(s => s.trim()).filter(Boolean);
}

const StudentPlannerPage: React.FC<Props> = ({ studentId }) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [schedule, setSchedule] = useState<StudentScheduleItem[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);

  // local preview selection set (sectionIds)
  const [previewed, setPreviewed] = useState<Set<number>>(new Set());

  useEffect(() => {
  (async () => {
    try {
      let sem = await getSemesters().catch(() => []);

      // FIX: properly normalize the data
      const sems: Semester[] = sem.map(s => ({
        ...s,
        orderInYear: s.orderInYear ?? 0
      }));

      setSemesters(sems);

      if (sems.length > 0) {
        setSelectedSemester(sems[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  })();
}, []);

  // load semester data
  useEffect(() => {
    if (!selectedSemester) return;
    (async () => {
      try {
        const [secs, sch, prog] = await Promise.all([
          getAvailableSections(studentId, selectedSemester),
          getStudentSchedule(studentId, selectedSemester),
          getStudentProgress(studentId)
        ]);
        setSections(secs);
        setSchedule(sch);
        setProgress(prog);
        setPreviewed(new Set());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [studentId, selectedSemester]);

  // tokens occupied by already-enrolled courses (server)
  const occupiedTokens = useMemo(() => {
    const s = new Set<string>();
    schedule.forEach(item => {
      const token = item.day && item.startTime && item.endTime ? `${item.day} ${item.startTime}-${item.endTime}` : (item.startTime ?? "");
      if (token) s.add(token);
    });
    return s;
  }, [schedule]);

  // tokens for previewed items
  const previewTokens = useMemo(() => {
    const tokens = new Set<string>();
    for (const id of Array.from(previewed)) {
      const sec = sections.find(x => x.sectionId === id);
      if (!sec) continue;
      parseScheduleTokens(sec.schedule).forEach(t => tokens.add(t));
    }
    return tokens;
  }, [previewed, sections]);

  function previewToggle(sectionId: number) {
    setPreviewed(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  function localConflictsWithPreview(section: Section): boolean {
    // check if any token in section.schedule collides with occupiedTokens or previewTokens (excluding itself)
    const toks = parseScheduleTokens(section.schedule);
    for (const t of toks) {
      if (occupiedTokens.has(t)) return true;
      // if previewTokens contains t and it's not the tokens of the same section (handled above)
      // but previewTokens includes itself; ensure when checking for preview collisions we ignore section's own tokens
      for (const otherId of Array.from(previewed)) {
        if (otherId === section.sectionId) continue;
        const other = sections.find(s => s.sectionId === otherId);
        if (!other) continue;
        const otherToks = parseScheduleTokens(other.schedule);
        if (otherToks.includes(t)) return true;
      }
    }
    return false;
  }

  async function handleAdd(section: Section) {
    if (!selectedSemester) { alert("Select a semester"); return; }
    try {
      const res = await enrollInSection(studentId, section.sectionId, selectedSemester);
      if (!res.ok) alert(res.message ?? "Enroll failed");
    } catch (e) {
      console.error(e);
      alert("Enroll request failed");
    } finally {
      // refresh
      const [secs, sch, prog] = await Promise.all([
        getAvailableSections(studentId, selectedSemester),
        getStudentSchedule(studentId, selectedSemester),
        getStudentProgress(studentId)
      ]);
      setSections(secs);
      setSchedule(sch);
      setProgress(prog);
      setPreviewed(new Set());
    }
  }

  async function handleDrop(sectionId: number) {
    try {
      const res = await dropSection(studentId, sectionId);
      if (!res.ok) alert(res.message ?? "Drop failed");
    } catch (e) {
      console.error(e);
      alert("Drop request failed");
    } finally {
      if (!selectedSemester) return;
      const [secs, sch, prog] = await Promise.all([
        getAvailableSections(studentId, selectedSemester),
        getStudentSchedule(studentId, selectedSemester),
        getStudentProgress(studentId)
      ]);
      setSections(secs);
      setSchedule(sch);
      setProgress(prog);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Student Planner</h2>

      <SemesterSelector semesters={semesters} selectedSemesterId={selectedSemester} onChange={(id) => setSelectedSemester(id)} />

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h3>Available Sections</h3>
          {sections.length === 0 && <div>No sections found</div>}
          {sections.map(sec => {
            // combine backend flags and client preview/conflict state
            const isPreviewed = previewed.has(sec.sectionId);
            const conflictLocal = localConflictsWithPreview(sec);
            const computedTimeConflict = sec.timeConflict || conflictLocal;
            const canAdd = Boolean(sec.canEnroll) && sec.prereqsMet !== false && !computedTimeConflict;

            return (
              <SectionCard
                key={sec.sectionId}
                section={{ ...sec, timeConflict: computedTimeConflict, canEnroll: canAdd, prereqsMet: sec.prereqsMet }}
                onAdd={handleAdd}
                onPreviewToggle={previewToggle}
                isPreviewed={isPreviewed}
              />
            );
          })}
        </div>

        <div style={{ width: 420 }}>
          <h3>My Schedule</h3>
          <Timetable schedule={schedule} onDrop={handleDrop} />

          <div style={{ marginTop: 16 }}>
            <strong>Progress:</strong>
            <div>Credits: {progress?.creditsEarned ?? 0} / {progress?.creditsRequired ?? 30} (Remaining: {progress?.creditsRemaining ?? 30})</div>
            <div>GPA / Pass ratio: {progress?.gpa ?? 0}</div>
            <div>Estimated years to graduate: {progress?.estimatedYears ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPlannerPage;
