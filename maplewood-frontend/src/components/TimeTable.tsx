// src/components/Timetable.tsx
import React from "react";
import { StudentScheduleItem } from "../types/models";
import ScheduleCard from "./ScheduleCard";

const Timetable: React.FC<{ schedule: StudentScheduleItem[]; onDrop: (sectionId: number) => void; }> = ({ schedule, onDrop }) => {
  if (!schedule || schedule.length === 0) return <div>No enrolled courses</div>;
  return (
    <div>
      {schedule.map(it => <ScheduleCard key={it.sectionId} item={it} onRemove={onDrop} />)}
    </div>
  );
};

export default Timetable;
