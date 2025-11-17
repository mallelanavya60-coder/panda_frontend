import './App.css';
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import WeeklyCalendar from "./components/WeeklyCalender";
import StudentPlannerPage from "./Pages/StudentPlannerPage";

function App() {
  return (
    <Router>
      <div className="p-4">
        {/* Simple Navigation */}
        <nav className="mb-6 space-x-4 text-blue-600 font-semibold">
          <Link to="/masterplan">Master Plan</Link>
          <Link to="/student-planner">Student Planner</Link>
        </nav>

        <Routes>
          <Route path="/" element={<WeeklyCalendar semesterId={1} />} />
          <Route path="/masterplan" element={<WeeklyCalendar semesterId={1} />} />
          <Route path="/student-planner" element={<StudentPlannerPage studentId={1} />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
