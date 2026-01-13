import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register } from "../features/auth";
import RequireAuth from "../shared/components/RequireAuth";
import InterviewDashboard from "../features/interviews/pages/InterviewDashboard";
import InterviewDetails from "../features/interviews/pages/InterviewDetails";
import InterviewRunner from "../features/interviews/pages/InterviewRunner";

// const Dashboard = () => (
//   <>
//     <Header />
//     <h1 className="p-6 text-2xl">Dashboard</h1>
//   </>
// );
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<InterviewDashboard />} />
          <Route path="/dashboard" element={<InterviewDashboard />} />
          <Route path="/interviews/:id" element={<InterviewDetails />} />
          <Route path="/interviews/:id/run" element={<InterviewRunner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
