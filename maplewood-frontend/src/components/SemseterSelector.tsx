// src/components/SemesterSelector.tsx
import React from "react";
import { Semester } from "../types/models";

interface Props {
  semesters: Semester[];
  selectedSemesterId: number;
  onChange: (semesterId: number) => void;
}

const SemesterSelector: React.FC<Props> = ({ semesters, selectedSemesterId, onChange }) => {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor="semester-select" style={{ marginRight: 8 }}>Select Semester:</label>
      <select id="semester-select" value={selectedSemesterId} onChange={(e) => onChange(Number(e.target.value))}>
        <option value={0}>-- Select --</option>
        {semesters.map(s => <option key={s.id} value={s.id}>{s.name} ({s.year})</option>)}
      </select>
    </div>
  );
};

export default SemesterSelector;
