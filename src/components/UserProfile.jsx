
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState({
    userName: "",
    emailId: "",
    phone: "",
  });

  const [adoptionApplications, setAdoptionApplications] = useState([]);
  const [fosterApplications, setFosterApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getUserProfile = async () => {
    const response = await axios.get(
      "/adoption/profile",
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setUser(response.data.user);
    }
  };

  const getAdoptionApplications = async () => {
    const response = await axios.get(
      "/adoption/applications",
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setAdoptionApplications(response.data.applications || []);
    }
  };

  const getFosterApplications = async () => {
    const response = await axios.get(
      "/adoption/foster/applications",
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setFosterApplications(response.data.applications || []);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          getUserProfile(),
          getAdoptionApplications(),
          getFosterApplications(),
        ]);
      } catch (error) {
        console.error("Profile error:", error.response?.data || error.message);
        setError(
          error.response?.data?.message ||
            "Unable to load profile information"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await axios.patch(
        "/adoption/profile",
        {
          userName: user.userName,
          emailId: user.emailId,
          phone: user.phone,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error(
        "Update profile error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "selected":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "selected":
        return "Selected";

      case "rejected":
        return "Rejected";

      case "pending":
      default:
        return "Pending";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 bg-gray-100">
      <Link to="/userfeed">
        <button
          type="button"
          className="bg-red-500 mt-8 cursor-pointer text-white p-2 m-4 rounded-sm"
        >
          Back
        </button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-red-500 font-righteous">
            My Profile
          </h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded-sm"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-sm disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="bg-gray-500 hover:bg-gray-400 text-white px-5 py-2 rounded-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="mb-5">
            <label className="block font-saira font-semibold mb-2">
              Name
            </label>

            <input
              type="text"
              name="userName"
              value={user.userName || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-5">
            <label className="block font-saira font-semibold mb-2">
              Contact Number
            </label>

            <input
              type="tel"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-saira font-semibold mb-2">
              Email ID
            </label>

            <input
              type="email"
              name="emailId"
              value={user.emailId || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl text-red-500 font-righteous mb-6">
            Adoption Application Status
          </h2>

          {adoptionApplications.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-white">
              <p className="text-gray-500 font-saira">
                You haven't submitted any adoption applications yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {adoptionApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-5">
                    <div>
                      <h3 className="text-xl font-saira font-bold">
                        {application.pet?.petName || "Pet"}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        Application ID: {application._id}
                      </p>

                      <p className="text-gray-500 mt-2">
                        Applied on:{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-3xl text-red-500 font-righteous mb-6">
            Foster Application Status
          </h2>

          {fosterApplications.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-white">
              <p className="text-gray-500 font-saira">
                You haven't submitted any foster applications yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {fosterApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-5">
                    <div>
                      <h3 className="text-xl font-saira font-bold">
                        {application.pet?.petName || "Pet"}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        Application ID: {application._id}
                      </p>

                      <p className="text-gray-500 mt-2">
                        Applied on:{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;


