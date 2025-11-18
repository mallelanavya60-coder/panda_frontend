// src/components/CourseList.tsx
import React from "react";
import { Section } from "../types/models";

interface Props {
  sections: (Section & { disabled?: boolean; prereqsMet?: boolean; timeConflict?: boolean; canEnroll?: boolean; })[];
  onEnroll: (sectionId: number) => void;
  onPreviewSelect?: (sectionId: number) => void; // toggle for local preview selection
}

const CourseList: React.FC<Props> = ({ sections, onEnroll, onPreviewSelect }) => {
  if (!sections.length) return <div>No sections available</div>;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
          <th>Course</th>
          <th>Section</th>
          <th>Schedule</th>
          <th>Room</th>
          <th>Teacher</th>
          <th>Seats</th>
          <th>Flags</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sections.map(sec => {
          const bg = sec.timeConflict ? "#fdecea" : (sec.prereqsMet === false ? "#fff4e5" : "#f2fff2");
          return (
            <tr key={sec.sectionId} style={{ background: bg, opacity: sec.canEnroll ? 1 : 0.6 }}>
              <td style={{ padding: "6px 8px" }}>{sec.courseCode} — {sec.courseName}</td>
              <td style={{ padding: "6px 8px" }}>{sec.sectionNumber ?? "—"}</td>
              <td style={{ padding: "6px 8px" }}>{sec.schedule}</td>
              <td style={{ padding: "6px 8px" }}>{sec.roomName}</td>
              <td style={{ padding: "6px 8px" }}>{sec.teacherName}</td>
              <td style={{ padding: "6px 8px" }}>{sec.seatsLeft ?? "—"}/{sec.capacity ?? "—"}</td>
              <td style={{ padding: "6px 8px", minWidth: 120 }}>
                {!sec.prereqsMet && <div style={{ color: "#a33" }}>Missing prereq</div>}
                {sec.timeConflict && <div style={{ color: "#a33" }}>Time conflict</div>}
              </td>
              <td style={{ padding: "6px 8px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => onEnroll(sec.sectionId)} disabled={!sec.canEnroll || sec.prereqsMet === false || sec.timeConflict}>
                    Enroll
                  </button>
                  {onPreviewSelect && (
                    <button onClick={() => onPreviewSelect(sec.sectionId)}>
                      Preview
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CourseList;
