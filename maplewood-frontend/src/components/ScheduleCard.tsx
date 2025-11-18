// src/components/ScheduleCard.tsx
import React from "react";
import { StudentScheduleItem } from "../types/models";

interface Props {
  item: StudentScheduleItem;
  onRemove?: (sectionId: number) => void;
}

const ScheduleCard: React.FC<Props> = ({ item, onRemove }) => {
  return (
    <div style={{ border: "1px solid #e6edf3", padding: 10, borderRadius: 8, marginBottom: 10, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{item.courseCode} — {item.courseName}</div>
          <div style={{ color: "#555" }}>{item.day ?? ""} {item.startTime ?? ""} - {item.endTime ?? ""}</div>
          <div style={{ color: "#666", fontSize: 13 }}>{item.roomName ?? ""} • {item.teacherName ?? ""}</div>
        </div>
        <div>
          {onRemove && <button onClick={() => onRemove(item.sectionId)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6 }}>Remove</button>}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
