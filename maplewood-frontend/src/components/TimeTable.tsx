// components/Timetable.tsx
import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { StudentScheduleItem } from "../types/models";

interface Props {
  schedule: StudentScheduleItem[];
  onDrop: (sourceId: number, destinationDay: string, startTime: string) => void;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const Timetable: React.FC<Props> = ({ schedule, onDrop }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sectionId = Number(result.draggableId);
    const [day, time] = result.destination.droppableId.split("_");
    onDrop(sectionId, day, time);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "1rem" }}>
        {days.map(day => (
          <Droppable key={day} droppableId={`${day}_08:00`}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ flex: 1, minHeight: "400px", border: "1px solid #ccc", padding: "0.5rem" }}
              >
                <h4>{day}</h4>
                {schedule
                  .filter(s => s.day === day)
                  .map((item, index) => (
                    <Draggable key={item.section_id} draggableId={item.section_id.toString()} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: "0.5rem",
                            marginBottom: "0.5rem",
                            backgroundColor: "#dfd",
                            border: "1px solid #888",
                            ...provided.draggableProps.style
                          }}
                        >
                          {item.course_code} ({item.start_time}-{item.end_time})
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
