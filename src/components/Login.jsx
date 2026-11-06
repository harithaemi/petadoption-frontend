
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)
    ) {
      newErrors.emailId = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await axios.post(
        "/login",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      const role = response.data.user?.role;

      if (role === "adopter") {
        navigate("/userfeed");
      } else if (role === "shelter") {
        navigate("/feed");
      } else {
        setErrors({
          form: "Unable to identify your account type. Please contact support.",
        });
      }
    } catch (error) {
      console.log(
        "Login error:",
        error.response?.data || error.message
      );

      setErrors({
        form: "Invalid email or password. Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 caret-red-600 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-gray-200 shadow-xl rounded-xl p-8 bg-white"
      >
        <h1 className="text-4xl font-righteous font-medium text-red-600 text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Login to your PetLover account
        </p>

        <div className="mb-5">
          <label
            htmlFor="emailId"
            className="block text-gray-800 font-medium mb-2"
          >
            Email Address
          </label>

          <input
            id="emailId"
            type="email"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            placeholder="Enter your email address"
            className={inputStyle}
          />

          {errors.emailId && (
            <p className="text-red-600 text-sm mt-1">
              {errors.emailId}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block text-gray-800 font-medium mb-2"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={inputStyle}
          />

          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

   
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3 mb-5">
            {errors.form}
          </div>
        )}

     
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-700 mt-6">
          New user?{" "}
          <Link
            to="/signup"
            className="text-red-600 font-medium hover:text-red-500"
          >
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Login;
