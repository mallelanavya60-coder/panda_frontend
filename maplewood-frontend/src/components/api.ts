export async function fetchAvailableSections(studentId:number, semesterId:number) {
  const res = await fetch(`/api/student/${studentId}/available-sections?semesterId=${semesterId}`);
  return res.json();
}
export async function enroll(studentId:number, sectionId:number, semesterId:number) {
  const res = await fetch(`/api/student/${studentId}/enroll`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ sectionId, semesterId })
  });
  return res.json();
}
export async function drop(studentId:number, sectionId:number) {
  const res = await fetch(`/api/student/${studentId}/enroll/${sectionId}`, { method: "DELETE" });
  return res.json();
}
export async function fetchStudentSchedule(studentId:number, semesterId:number) {
  const res = await fetch(`/api/student/${studentId}/schedule?semesterId=${semesterId}`);
  return res.json();
}
export async function fetchProgress(studentId:number) {
  const res = await fetch(`/api/student/${studentId}/progress`);
  return res.json();
}
