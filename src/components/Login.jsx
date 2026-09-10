
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:7777/login",
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




