import React from "react";
import { SectionDto } from "./SectionCard";

interface Props {
  section: SectionDto;
  onRemove?: (sectionId: number) => void;
}

const ScheduleCard: React.FC<Props> = ({ section, onRemove }) => {
  return (
    <div className="border rounded p-3 mb-3 shadow-sm bg-white">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{section.course_code} — {section.course_name}</div>
          <div className="text-sm text-gray-600">{section.teacher_name || "TBD"}</div>
          <div className="text-sm text-gray-600">{section.schedule_str || "TBD"}</div>
        </div>
        <div>
          {onRemove && (
            <button
              onClick={() => onRemove(section.section_id)}
              className="px-3 py-1 rounded text-sm bg-red-600 text-white"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;

