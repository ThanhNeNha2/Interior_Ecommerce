import { useState } from "react";
import "./Login.scss";
import { apiCustom } from "../../custom/customApi";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setIsActive(true);
  };
  const handleLoginClick = () => {
    setIsActive(false);
  };

  // ĐĂNG NHẬP
  const [valueLogin, setValueLogin] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: any) => {
    setValueLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      if (!valueLogin.email || !valueLogin.password) {
        toast.error("Vui lòng nhập đầy đủ thông tin !");
        return;
      }

      const response = await apiCustom.post("/auth/login", valueLogin);
      toast.success("Đăng nhập thành công ");
      console.log("Login successful:", response.data);
      navigate("/");
      localStorage.setItem("user", JSON.stringify(response));
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Đăng nhập không thành công ");
    }
  };

  //  ĐĂNG KÝ
  const [valueRegister, setValueRegister] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChangeRegister = (e: any) => {
    setValueRegister((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //
  const handleRegister = async (e: any) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = valueRegister;

    // Kiểm tra input
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin !");
      return;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không đúng định dạng!");
      return;
    }

    // Kiểm tra mật khẩu
    if (password.length < 7) {
      toast.error("Password ít nhất 7 ký tự !");
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      alert(" Confirm Password không chính xác  ");
      return;
    }
    // alert(" hahahha");
    // console.log("valueRegister:", valueRegister);
    try {
      const response = await apiCustom.post("/auth/register", {
        username,
        email,
        password,
      });
      toast.success("Đăng ký thành công!"); // Thông báo đăng ký thành công
      console.log("Register successful:", response);
      navigate("/login"); // Chuyển về trang đăng nhập
    } catch (error: any) {
      console.error("Register failed:", error);
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký!"
      );
    }
  };
  return (
    <div className="Login">
      <Toaster position="top-right" />

      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {/* Register */}
        <div className="form-container sign-up">
          <form
            onSubmit={(e) => {
              handleRegister(e);
            }}
          >
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#!" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#!" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#!" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#!" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              name="username"
              onChange={(e) => handleChangeRegister(e)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChangeRegister(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChangeRegister(e)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(e) => handleChangeRegister(e)}
            />
            <button>Sign Up</button>
          </form>
        </div>

        {/* Login  */}
        <div className="form-container sign-in">
          <form
            onSubmit={(e) => {
              handleLogin(e);
            }}
          >
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#!" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#!" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#!" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#!" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email password</span>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <a href="#">Forget Your Password?</a>
            <button>Sign In</button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>
                Enter your personal details to use all of the site's features
              </p>
              <Link to={"/login"}>
                <button
                  className="hidden"
                  id="login"
                  onClick={handleLoginClick}
                >
                  Sign In
                </button>
              </Link>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all of the site's
                features
              </p>
              <Link to={"/register"}>
                <button
                  className="hidden"
                  id="register"
                  onClick={handleRegisterClick}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
