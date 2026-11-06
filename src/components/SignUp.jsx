
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

  const passwordChecks = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

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
      newErrors.emailId = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!Object.values(passwordChecks).every(Boolean)) {
      newErrors.password = "Please meet all password requirements";
    }

    if (!formData.role) {
      newErrors.role = "Please select an account type";
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

      await axios.post("/signup", formData, {
        withCredentials: true,
      });

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

      const responseData = error.response?.data;

      const message =
        typeof responseData === "string"
          ? responseData
          : responseData?.message || "Registration failed. Please try again.";

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("username")) {
        setErrors({ userName: message });
      } else if (lowerMessage.includes("email")) {
        setErrors({ emailId: message });
      } else if (lowerMessage.includes("password")) {
        setErrors({ password: message });
      } else {
        setErrors({ form: message });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 caret-red-600 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500";

  const errorStyle = "text-red-600 text-sm mt-1";

  const Requirement = ({ valid, children }) => (
    <p className={`text-xs flex items-center gap-2 ${
      valid ? "text-green-600" : "text-gray-500"
    }`}>
      <span>{valid ? "✓" : "○"}</span>
      {children}
    </p>
  );

  return (
  <div className="min-h-screen flex items-center mt-12 justify-center bg-gray-100 px-4 py-8">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-gray-200 shadow-xl rounded-xl p-8 bg-white"
      >
        <h1 className="text-4xl font-righteous font-medium text-red-600 text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Join our pet adoption community
        </p>

     
        <div className="mb-5">
          <label htmlFor="userName" className="block text-gray-800 font-medium mb-2">
            Username
          </label>

          <input
            id="userName"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your username"
            className={inputStyle}
          />

          {errors.userName && (
            <p className={errorStyle}>{errors.userName}</p>
          )}
        </div>

       
        <div className="mb-5">
          <label htmlFor="emailId" className="block text-gray-800 font-medium mb-2">
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
            <p className={errorStyle}>{errors.emailId}</p>
          )}
        </div>

     
        <div className="mb-5">
          <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
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
            <p className={errorStyle}>{errors.password}</p>
          )}

          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-800 text-sm font-medium mb-2">
              Password must contain:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Requirement valid={passwordChecks.length}>
                At least 6 characters
              </Requirement>

              <Requirement valid={passwordChecks.uppercase}>
                Uppercase letter (A-Z)
              </Requirement>

              <Requirement valid={passwordChecks.lowercase}>
                Lowercase letter (a-z)
              </Requirement>

              <Requirement valid={passwordChecks.number}>
                Number (0-9)
              </Requirement>

              <Requirement valid={passwordChecks.special}>
                Special character (@, #, !)
              </Requirement>
            </div>
          </div>
        </div>

    
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-800 font-medium mb-2">
            Account Type
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="" disabled>
              Select your account type
            </option>

            <option value="adopter">Adopter</option>
            <option value="shelter">Shelter</option>
          </select>

          {errors.role && (
            <p className={errorStyle}>{errors.role}</p>
          )}
        </div>

      
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3 mb-5">
            {errors.form}
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

        <p className="text-center text-gray-700 mt-6">
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
