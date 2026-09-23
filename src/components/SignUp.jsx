
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.userName.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!formData.emailId.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.emailId.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!formData.role) {
      setError("Please select your role.");
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

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log("Signup error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
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
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
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
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
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
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />

          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters.
          </p>
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
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value="" disabled>
              Select your account type
            </option>
            <option value="adopter">Adopter</option>
            <option value="shelter">Shelter</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3 mb-5">
            {error}
          </div>
        )}

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

