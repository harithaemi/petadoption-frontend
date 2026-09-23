
import React, { useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

const FosterApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    currentProfession: "",
    phone: "",
    location: "",
    residenceType: "",
    petFriendly: "",
    houseType: "",
    aboutYou: "",
  });

  const [message, setMessage] = useState("");
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
    setMessage("");

    const requiredFields = [
      "fullName",
      "email",
      "age",
      "currentProfession",
      "phone",
      "location",
      "residenceType",
      "petFriendly",
      "houseType",
      "aboutYou",
    ];

    const isEmpty = requiredFields.some((field) => !formData[field]);

    if (isEmpty) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/adoption/fosterapplication",
        {
          pet: id,
          fullName: formData.fullName,
          email: formData.email,
          age: Number(formData.age),
          currentProfession: formData.currentProfession,
          phone: formData.phone,
          location: formData.location,
          residenceType: formData.residenceType,
          petFriendly: formData.petFriendly === "true",
          houseType: formData.houseType,
          aboutYou: formData.aboutYou,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessage("Foster application submitted successfully");

        setTimeout(() => {
          navigate("/adoption/profile");
        }, 1000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to submit foster application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <Link to="/userfeed">
        <button
          type="button"
          className="bg-red-500 mt-8 cursor-pointer text-white p-2 m-4 rounded-sm"
        >
          Back
        </button>
      </Link>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 font-saira">
            Foster Application
          </h1>

          <p className="text-gray-500 mt-3">
            Help give a pet a safe, loving and temporary home.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-red-500 text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border-2 border-red-100 rounded-lg p-3 focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-red-500 text-sm font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border-2 border-red-100 rounded-lg p-3 focus:outline-none focus:border-red-400"
              />
            </div>

            <div>
              <label className="block text-red-500 text-sm font-medium mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full border-2 border-red-100 rounded-lg p-3 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-red-500 text-sm font-medium mb-2">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                placeholder="Enter your age"
                className="w-full border-2 border-red-100 rounded-lg p-3 focus:outline-none focus:border-red-400"
              />
            </div>

            <div>
              <label className="block text-red-500 text-sm font-medium mb-2">
                Current Profession
              </label>

              <input
                type="text"
                name="currentProfession"
                value={formData.currentProfession}
                onChange={handleChange}
                placeholder="Enter your profession"
                className="w-full border-2 border-red-100 rounded-lg p-3 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-red-500 text-sm font-medium mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your city/location"
              className="w-full border-2 border-red-100 rounded-lg p-3 focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">
              Tell us about your home
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                What type of residence do you live in?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 border border-red-100 rounded-lg p-3 cursor-pointer hover:bg-red-50">
                  <input
                    type="radio"
                    name="residenceType"
                    value="House"
                    checked={formData.residenceType === "House"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span>House</span>
                </label>

                <label className="flex items-center gap-3 border border-red-100 rounded-lg p-3 cursor-pointer hover:bg-red-50">
                  <input
                    type="radio"
                    name="residenceType"
                    value="Apartment"
                    checked={formData.residenceType === "Apartment"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span>Apartment</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Do you own or rent your home?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 border border-red-100 rounded-lg p-3 cursor-pointer hover:bg-red-50">
                  <input
                    type="radio"
                    name="houseType"
                    value="Own"
                    checked={formData.houseType === "Own"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span>Own</span>
                </label>

                <label className="flex items-center gap-3 border border-red-100 rounded-lg p-3 cursor-pointer hover:bg-red-50">
                  <input
                    type="radio"
                    name="houseType"
                    value="Rental"
                    checked={formData.houseType === "Rental"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span>Rental</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Is your home pet friendly?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 border border-red-100 rounded-lg p-3 cursor-pointer hover:bg-red-50">
                  <input
                    type="radio"
                    name="petFriendly"
                    value="true"
                    checked={formData.petFriendly === "true"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-3 border border-red-100 rounded-lg p-3 cursor-pointer hover:bg-red-50">
                  <input
                    type="radio"
                    name="petFriendly"
                    value="false"
                    checked={formData.petFriendly === "false"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About You
            </h2>

            <p className="text-gray-500 mb-4">
              Tell us about yourself, your experience with pets, and why you
              would like to foster this pet.
            </p>

            <textarea
              name="aboutYou"
              value={formData.aboutYou}
              onChange={handleChange}
              rows="6"
              placeholder="Tell us about yourself and your experience with pets..."
              className="w-full border-2 border-red-100 rounded-lg p-3 resize-none focus:outline-none focus:border-red-400"
            />
          </div>

          {message && (
            <p
              className={`text-center font-medium ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <div className="pt-5 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-10 py-3 rounded-lg font-medium hover:bg-red-500 transition disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FosterApplication;
