
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
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    if (
      !formData.userName ||
      !formData.emailId ||
      !formData.password ||
      !formData.role
    ) {
      setError("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:7777/signup",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Signup response:", response.data);

      setSuccess("Registration successful!");


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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col border-2 border-red-500 shadow-lg rounded-lg p-6 bg-white"
      >
        <h1 className="text-4xl font-righteous font-medium text-red-600 text-center mb-6">
          Sign Up
        </h1>

        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Username"
          className="p-3 border border-gray-300 rounded-md mb-4 bg-white"
        />

        <input
          type="email"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          placeholder="Email"
          className="p-3 border border-gray-300 rounded-md mb-4 bg-white"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="p-3 border border-gray-300 rounded-md mb-4 bg-white"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md mb-6 bg-white"
        >
          <option value="" disabled>
            Select Role
          </option>

          <option value="adopter">Adopter</option>
          <option value="shelter">Shelter</option>
        </select>

       
        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

       
        {success && (
          <p className="text-green-600 text-center mb-4">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-500 transition disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="m-2">
          Already have an account?{" "}
          <span className="text-red-600">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;


