// src/components/SectionCard.tsx
import React from "react";
import { Section } from "../types/models";

interface Props {
  section: Section;
  onAdd?: (s: Section) => void;
  onPreviewToggle?: (sectionId: number) => void;
  isPreviewed?: boolean;
  disabled?: boolean;
}

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: 6,
  fontSize: 12,
  marginRight: 6
};

const SectionCard: React.FC<Props> = ({ section, onAdd, onPreviewToggle, isPreviewed, disabled }) => {
  const {
    courseCode,
    courseName,
    teacherName,
    roomName,
    schedule,
    sectionNumber,
    capacity,
    seatsLeft,
    timeConflict,
    prereqsMet,
    canEnroll,
    sectionId
  } = section;

  const bg = timeConflict ? "#fff5f5" : (prereqsMet === false ? "#fff9f0" : isPreviewed ? "#f0f9ff" : "#ffffff");

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 12, background: bg, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>{courseCode ?? "—"} — {courseName ?? "—"}</div>
          <div style={{ color: "#555", fontSize: 13 }}>{teacherName ?? "TBD"} • {roomName ?? "TBD"}</div>
          <div style={{ color: "#666", marginTop: 6, fontSize: 13 }}>{schedule ?? "TBA"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13 }}>{(seatsLeft != null && capacity != null) ? `${seatsLeft}/${capacity}` : ""}</div>
          <div style={{ marginTop: 8 }}>
            {prereqsMet === false && <span style={{ ...badgeStyle, background: "#ffe9e9", color: "#b22222" }}>Missing prereq</span>}
            {timeConflict && <span style={{ ...badgeStyle, background: "#ffeaea", color: "#b22222" }}>Time conflict</span>}
            {isPreviewed && <span style={{ ...badgeStyle, background: "#e6f7ff", color: "#0b6fb0" }}>Preview</span>}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {onPreviewToggle && (
          <button
            onClick={() => onPreviewToggle(sectionId)}
            style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: isPreviewed ? "#0ea5e9" : "#fff", color: isPreviewed ? "#fff" : "#111" }}
          >
            {isPreviewed ? "Unpreview" : "Preview"}
          </button>
        )}

        {onAdd && (
          <button
            onClick={() => onAdd(section)}
            disabled={!canEnroll || prereqsMet === false || timeConflict || disabled}
            style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: (!canEnroll || prereqsMet === false || timeConflict || disabled) ? "#cbd5e1" : "#0369a1", color: "#fff" }}
          >
            {canEnroll ? "Add" : "Cannot add"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionCard;
