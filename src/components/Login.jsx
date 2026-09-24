
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "/login",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      const role = response.data.user.role;

      if (role === "adopter") {
        navigate("/userfeed");
      } else if (role === "shelter") {
        navigate("/feed");
      }
    } catch (error) {
      console.log(
        "Login error:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid credentials";

      if (
        message.toLowerCase().includes("email") ||
        message.toLowerCase().includes("user")
      ) {
        setErrors((prev) => ({
          ...prev,
          emailId: message,
        }));
      } else if (
        message.toLowerCase().includes("password") ||
        message.toLowerCase().includes("credential")
      ) {
        setErrors((prev) => ({
          ...prev,
          password: message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: message,
        }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col border-2 border-red-500 shadow-lg rounded-lg p-6 bg-white"
      >
        <h1 className="text-4xl font-righteous font-medium text-red-600 text-center mb-6">
          Login
        </h1>

        <input
          type="email"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          placeholder="Email"
          className={`p-3 border rounded-md bg-white outline-none focus:ring-1 ${
            errors.emailId
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-red-500 focus:ring-red-500"
          }`}
        />

        {errors.emailId && (
          <p className="text-red-500 text-sm mt-1 mb-3">
            {errors.emailId}
          </p>
        )}

        {!errors.emailId && <div className="mb-4" />}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className={`p-3 border rounded-md bg-white outline-none focus:ring-1 ${
            errors.password
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-red-500 focus:ring-red-500"
          }`}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1 mb-3">
            {errors.password}
          </p>
        )}

        {!errors.password && <div className="mb-4" />}

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-500 transition"
        >
          Login
        </button>

        <p className="m-2">
          New user?{" "}
          <span className="text-red-600">
            <Link to="/signup">SignUp</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
