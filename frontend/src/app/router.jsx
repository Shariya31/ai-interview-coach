import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register } from "../features/auth";
import RequireAuth from "../shared/components/RequireAuth";
import Header from "../shared/components/Header";

const Dashboard = () => (
  <>
    <Header />
    <h1 className="p-6 text-2xl">Dashboard</h1>
  </>
);
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
