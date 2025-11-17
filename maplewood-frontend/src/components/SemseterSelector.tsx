// src/components/SemesterSelector.tsx
import React from "react";
import { Semester } from "../types/models";

interface Props {
  semesters: Semester[];
  selectedSemesterId: number;
  onChange: (semesterId: number) => void;
}

export const SemesterSelector: React.FC<Props> = ({ semesters, selectedSemesterId, onChange }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="semester-select" style={{ marginRight: "0.5rem" }}>
        Select Semester:
      </label>
      <select
        id="semester-select"
        value={selectedSemesterId}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ padding: "0.25rem 0.5rem" }}
      >
        {semesters.map((sem) => (
          <option key={sem.id} value={sem.id}>
            {sem.name} ({sem.year})
          </option>
        ))}
      </select>
    </div>
  );
};
 export default SemesterSelector;