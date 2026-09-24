
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    emailId: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
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
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    }

    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = "Email is not valid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Please enter a stronger password";
    }

    if (!formData.role) {
      newErrors.role = "Account type is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/signup", formData, {
        withCredentials: true,
      });

      console.log("Signup response:", response.data);

      setSuccess("Registration successful! Redirecting to login...");

      setFormData({
        userName: "",
        emailId: "",
        password: "",
        role: "",
      });

      setErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log("Signup error:", error.response?.data);

      const message = error.response?.data || "Registration failed";

      if (message.toLowerCase().includes("username")) {
        setErrors((prev) => ({
          ...prev,
          userName: message.replace("error saving the user", "").trim(),
        }));
      } else if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({
          ...prev,
          emailId: message.replace("error saving the user", "").trim(),
        }));
      } else if (message.toLowerCase().includes("password")) {
        setErrors((prev) => ({
          ...prev,
          password: message.replace("error saving the user", "").trim(),
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          userName: message.replace("error saving the user", "").trim(),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-gray-200 shadow-xl rounded-xl p-8 bg-white"
      >
        <h1 className="text-4xl font-righteous font-medium text-red-600 text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Join our pet adoption community
        </p>

        <div className="mb-5">
          <label
            htmlFor="userName"
            className="block text-gray-700 font-medium mb-2"
          >
            Username
          </label>

          <input
            id="userName"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your username"
            className={`w-full p-3 border rounded-md bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-1 ${
              errors.userName
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-red-500 focus:ring-red-500"
            }`}
          />

          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="emailId"
            className="block text-gray-700 font-medium mb-2"
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
            className={`w-full p-3 border rounded-md bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-1 ${
              errors.emailId
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-red-500 focus:ring-red-500"
            }`}
          />

          {errors.emailId && (
            <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
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
            className={`w-full p-3 border rounded-md bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-1 ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-red-500 focus:ring-red-500"
            }`}
          />

          {errors.password ? (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Use a strong password with at least 6 characters.
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-2"
          >
            Account Type
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md bg-white text-gray-800 outline-none focus:ring-1 ${
              errors.role
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-red-500 focus:ring-red-500"
            }`}
          >
            <option value="" disabled>
              Select your account type
            </option>
            <option value="adopter">Adopter</option>
            <option value="shelter">Shelter</option>
          </select>

          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-md p-3 mb-5">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 font-medium hover:text-red-500"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
