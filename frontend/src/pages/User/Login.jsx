import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { setAuthData } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
// import { clearAuthData } from './authSlice';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const user = useSelector((state) => state.auth.user);

  console.log(user);


  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(process.env.REACT_APP_API_BASE_URL, "heyyyy");
      console.log(
        "Attempting to connect to:",
        process.env.REACT_APP_API_BASE_URL
      );

      const response = await api.post("login/", { email, password });
      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("ACCESS_TOKEN", response.data.access);
      localStorage.setItem("REFRESH_TOKEN", response.data.refresh);
      // const {user,token} = response.data;
      // localStorage.setItem('ACCESS_TOKEN',token);
      dispatch(setAuthData(response.data));
      if (response.data.status === 200) {
      navigate("/", { replace: true });
      }
      if (response.data.status === 400) {
        toast.error('Login faliled.Please check your credentials.');
        }
    } catch (error) {
      console.error("Login Failed:", error);
      console.error("Login failed:", error?.response?.data || error.message);
      console.error("Login Failed:", {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data,
        config: error?.config,
      });
      setError("Login faliled.Please check your credentials");
    }
  };


  console.log(user);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col justify-center items-center mb-6">
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 rounded-full shadow-lg">
            User Login
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={togglePasswordVisibility} // Toggle password visibility
              className="absolute top-2 right-2 cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}{" "}
              {/* Change the icon based on visibility */}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            LOGIN
          </button>
        </form>

        

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link to="/register" className="text-blue-500 hover:underline">
              Signup
            </Link>
            <br />
            Switch to Admin?
            <Link to="/admin/login" className="text-blue-500 hover:underline">
              Admin-Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;