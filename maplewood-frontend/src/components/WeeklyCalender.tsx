import React, { useEffect, useState } from "react";

type Section = {
  course: string;
  course_name?: string;
  section: number;
  teacher: string;
  room: string;
  capacity: number;
  students_enrolled: number;
  schedule: string[]; // e.g. "Mon 09:00-10:00"
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOUR_SLOTS = ["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]; // 7 slots (12:00-13:00 lunch excluded)

function parseScheduleToken(token: string) {
  // token like "Mon 09:00-10:00" or "Fri 14:00-16:00"
  const [day, timeRange] = token.split(" ");
  const [start, end] = timeRange.split("-");
  return { day, start, end };
}

// compute grid row span (hours) from start/end
function computeRowSpan(start: string, end: string) {
  const s = parseInt(start.split(":")[0], 10);
  const e = parseInt(end.split(":")[0], 10);
  return Math.max(1, e - s);
}

export default function WeeklyCalender({ semesterId = 1 }: { semesterId?: number }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line
  }, [semesterId]);

  async function fetchSchedule() {
    setLoading(true);
    try {
      const res = await fetch(`/api/schedule/${semesterId}`);
      if (!res.ok) throw new Error("Failed to load schedule");
      const data: Section[] = await res.json();
      setSections(data);
    } catch (err) {
      console.error(err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }

  // Build a mapping of day->start->list of sections starting at that time
  const gridMap: Record<string, Record<string, Section[]>> = {};
  for (const d of DAYS) gridMap[d] = {};
  for (const s of sections) {
    for (const token of s.schedule) {
      const parsed = parseScheduleToken(token);
      const { day, start } = parsed;
      gridMap[day] = gridMap[day] || {};
      gridMap[day][start] = gridMap[day][start] || [];
      gridMap[day][start].push(s);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Master Schedule — Semester {semesterId}</h2>
      {loading ? <div>Loading…</div> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Time</th>
                {DAYS.map(d => <th key={d} style={{ border: "1px solid #ddd", padding: 8 }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {HOUR_SLOTS.map((hour) => (
                <tr key={hour}>
                  <td style={{ border: "1px solid #ddd", padding: 8, width: 120 }}>{hour}</td>
                  {DAYS.map(day => (
                    <td key={day + hour} style={{ border: "1px solid #ddd", padding: 8, verticalAlign: "top", height: 80 }}>
                      {/* For each section starting at this day+hour */}
                      {(gridMap[day][hour] || []).map((sec, idx) => {
                        // find matching token to compute span & end time
                        const token = sec.schedule.find(t => t.startsWith(day + " " + hour));
                        const { end } = token ? parseScheduleToken(token) : { end: hour };
                        return (
                          <div key={sec.course + sec.section + idx}
                               style={{
                                 marginBottom: 6,
                                 padding: 6,
                                 borderRadius: 6,
                                 background: "#f3f4f6",
                                 boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                               }}>
                            <div style={{ fontWeight: 700 }}>{sec.course} · Section {sec.section}</div>
                            <div style={{ fontSize: 12 }}>{sec.teacher} · {sec.room}</div>
                            <div style={{ fontSize: 12, marginTop: 4 }}>
                              {hour} — {end} · {sec.students_enrolled}/{sec.capacity}
                            </div>
                          </div>
                        );
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}