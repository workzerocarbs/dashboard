import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/LoginAPI";
import "../login/style.scss";
import { FaRegEnvelope, FaKey, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Button from "@mui/material/Button";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ZeroCarbs | Login";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      console.log(response);
      if (response.data.success) {
        const token = response.data.data.access_token;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("authToken", token);
        onLogin(true);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Error during authentication");
    }
  };

  const togglePasswordIcon = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordClick = () => {
    navigate("/reset-password");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>
          Zero<span>Carbs</span>
        </h2>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaRegEnvelope className="icon" size={22} />
          </div>
          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaKey className="icon" size={22} />
            {showPassword ? (
              <FaRegEye
                className="show-hide"
                size={22}
                onClick={togglePasswordIcon}
              />
            ) : (
              <FaRegEyeSlash
                className="show-hide"
                size={22}
                onClick={togglePasswordIcon}
              />
            )}
          </div>
          <div className="checkbox-text">
            <div className="checkbox-content">
              <input type="checkbox" id="logCheck" />
              <label className="text">Remember Me</label>
            </div>
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="forgot-text"
            >
              Forgot Password
            </button>
          </div>
          <Button className="login-btn" type="submit">
            Login
          </Button>
        </form>
        <div className="login-signup">
          <span className="text">Don&apos;t have an account?</span>
          <Link to="/signup" className="signup-link">
            SignUp Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
