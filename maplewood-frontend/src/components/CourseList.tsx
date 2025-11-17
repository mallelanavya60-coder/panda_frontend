import React from "react";
import { Section } from "../types/models";

interface Props {
  sections: Section[];
  onEnroll: (sectionId: number) => void;
}

export const CourseList: React.FC<Props> = ({ sections, onEnroll }) => (
  <table>
    <thead>
      <tr>
        <th>Course</th>
        <th>Section</th>
        <th>Schedule</th>
        <th>Seats Left</th>
        <th>Teacher</th>
        <th>Enroll</th>
      </tr>
    </thead>
    <tbody>
      {sections.map(sec => (
        <tr key={sec.section_id} style={{ 
      backgroundColor: sec.time_conflict ? "#fdd" : !sec.prereq_ok ? "#ffd" : "#dfd",
      opacity: sec.can_enroll ? 1 : 0.5
}}>
          <td>{sec.course_code} - {sec.course_name}</td>
          <td>{sec.section_number}</td>
          <td>{sec.schedule_str}</td>
          <td>{sec.seats_left}</td>
          <td>{sec.teacher_name}</td>
          <td>
            <button onClick={() => onEnroll(sec.section_id)} disabled={!sec.can_enroll}>
              Enroll
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
