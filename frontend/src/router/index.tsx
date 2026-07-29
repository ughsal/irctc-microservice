import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function LoginPage() {
  return <main><h1>Login</h1><p>Authentication UI goes here.</p></main>;
}

function HomePage() {
  return <main><h1>IRCTC</h1><p>Frontend initialized.</p></main>;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/bookings" element={<p>Bookings</p>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
