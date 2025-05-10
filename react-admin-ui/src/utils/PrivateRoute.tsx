import { Navigate, Outlet } from "react-router-dom";

// Hàm kiểm tra người dùng đã đăng nhập hay chưa
const PrivateRoute = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  // Nếu chưa có user, chuyển đến /login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
