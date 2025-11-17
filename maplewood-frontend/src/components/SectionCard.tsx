import React from "react";

export interface SectionDto {
  section_id: number;
  section_number?: number;
  course_id?: number;
  course_code?: string;
  course_name?: string;
  capacity?: number;
  enrolled?: number;
  schedule_str?: string; // e.g. "Mon 09:00-10:00|Wed 09:00-10:00" or comma separated
  teacher_name?: string;
  room_name?: string;
  seats_left?: number;
  time_conflict?: boolean;
  prereq_ok?: boolean;
  can_enroll?: boolean;
}

interface Props {
  section: SectionDto;
  onAdd?: (s: SectionDto) => void;
  onRemove?: (id: number) => void;
  disabled?: boolean;
}

const SectionCard: React.FC<Props> = ({ section, onAdd, onRemove, disabled }) => {
  const {
    course_code,
    course_name,
    teacher_name,
    room_name,
    schedule_str,
    enrolled,
    capacity,
    seats_left,
    time_conflict,
    prereq_ok,
    can_enroll,
  } = section;

  return (
    <div className={`border rounded p-3 mb-3 shadow-sm ${time_conflict ? "bg-red-50" : "bg-white"}`}>
      <div className="flex justify-between">
        <div>
          <div className="font-semibold text-md">{course_code} — {course_name}</div>
          <div className="text-sm text-gray-600">{teacher_name || "TBD"} • {room_name || "TBD"}</div>
        </div>
        <div className="text-right">
          <div className="text-sm">{enrolled ?? 0}/{capacity ?? 10}</div>
          <div className="text-xs text-gray-500">{seats_left != null ? `${seats_left} seats left` : ""}</div>
        </div>
      </div>

      <div className="mt-2 text-sm">
        <b>Schedule:</b> <span>{schedule_str || "TBD"}</span>
      </div>

      <div className="mt-2 flex gap-2 items-center">
        {prereq_ok === false && <span className="text-red-600 text-sm">Missing prerequisite</span>}
        {time_conflict && <span className="text-red-600 text-sm">Time conflict</span>}
        <div className="ml-auto">
          {onAdd && (
            <button
              disabled={disabled || !can_enroll}
              onClick={() => onAdd(section)}
              className={`px-3 py-1 rounded text-sm ${(!can_enroll || disabled) ? "bg-gray-300 text-gray-700" : "bg-blue-600 text-white"}`}
            >
              {can_enroll ? "Add" : "Cannot add"}
            </button>
          )}

          {onRemove && (
        <button
          onClick={() => onRemove(section.section_id)}
          style={{ marginLeft: "10px", background: "lightcoral" }}
        >
          Remove
        </button>
      )}
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
