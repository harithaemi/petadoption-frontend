
import React, { useEffect, useState } from "react";
import axios from "axios";

const ShelterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [adoptionApplications, setAdoptionApplications] = useState([]);
  const [fosterApplications, setFosterApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    emailId: "",
  });

  const fetchShelterData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        profileResponse,
        adoptionResponse,
        fosterResponse,
      ] = await Promise.all([
        axios.get("/shelter/profile", {
          withCredentials: true,
        }),
        axios.get(
          "/shelter/applications/adoption",
          {
            withCredentials: true,
          }
        ),
        axios.get(
          "/shelter/applications/foster",
          {
            withCredentials: true,
          }
        ),
      ]);

      console.log("Shelter profile:", profileResponse.data);
      console.log("Adoption applications:", adoptionResponse.data);
      console.log("Foster applications:", fosterResponse.data);

      if (profileResponse.data.success) {
        const user = profileResponse.data.user;

        setProfile(user);

        setFormData({
          userName: user.userName || "",
          emailId: user.emailId || "",
        });
      }

      if (adoptionResponse.data.success) {
        setAdoptionApplications(
          adoptionResponse.data.applications || []
        );
      }

      if (fosterResponse.data.success) {
        setFosterApplications(
          fosterResponse.data.applications || []
        );
      }
    } catch (error) {
      console.error(
        "Shelter profile error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load shelter profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelterData();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "selected":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.patch(
        "/shelter/profile",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Update profile:", response.data);

      if (response.data.success) {
        setProfile(response.data.user);
        setEditing(false);
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
    }
  };

  const updateApplicationStatus = async (
    type,
    applicationId,
    status
  ) => {
    try {
      let url = "";

      if (type === "adoption") {
        url = `/shelter/applications/adoption/${applicationId}/status`;
      }

      if (type === "foster") {
        url = `/shelter/applications/foster/${applicationId}/status`;
      }

      const response = await axios.patch(
        url,
        { status },
        {
          withCredentials: true,
        }
      );

      console.log("Application status:", response.data);

      if (response.data.success) {
        await fetchShelterData();
      }
    } catch (error) {
      console.error(
        "Application status error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update application status"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <p className="text-lg font-saira">
          Loading shelter profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-6 flex justify-center">
        <div className="text-center">
          <p className="text-red-500 font-saira">
            {error}
          </p>

          <button
            onClick={fetchShelterData}
            className="mt-4 bg-black text-white px-5 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-saira font-bold">
              Shelter Profile
            </h2>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-black text-white px-5 py-2 rounded"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-gray-500 text-sm">
                  Username
                </p>
                <p className="font-semibold text-lg">
                  {profile?.userName}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Email
                </p>
                <p className="font-semibold text-lg">
                  {profile?.emailId}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Role
                </p>
                <p className="font-semibold text-lg capitalize">
                  {profile?.role}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">
                  Username
                </label>

                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full p-3"
                />
              </div>

              <div className="mb-5">
                <label className="block font-semibold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full p-3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-green-600 text-white px-5 py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-saira font-bold mb-4">
            Adoption Applications
          </h3>

          <div className="border-t border-gray-300 mb-6"></div>

          {adoptionApplications.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500 font-saira">
                No adoption applications received
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {adoptionApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={application.pet?.image}
                      alt={application.pet?.petName}
                      className="w-full md:w-40 h-40 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <h4 className="text-2xl font-saira font-bold">
                        {application.pet?.petName}
                      </h4>

                      <p className="text-gray-500 mt-1">
                        {application.pet?.gender},{" "}
                        {application.pet?.age} year
                        {application.pet?.age !== 1 ? "s" : ""}
                      </p>

                      <p className="text-gray-500">
                        Location: {application.pet?.location}
                      </p>

                      <p className="text-gray-600 mt-2">
                        {application.pet?.about}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-semibold capitalize ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status || "pending"}
                      </span>
                    </div>
                  </div>

                  <hr className="my-6" />

                  <h4 className="text-xl font-saira font-bold mb-4">
                    Applicant Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {application.fullName}
                    </p>

                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {application.email}
                    </p>

                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {application.phone}
                    </p>

                    <p>
                      <span className="font-semibold">Age:</span>{" "}
                      {application.age}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Profession:
                      </span>{" "}
                      {application.currentProfession}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {application.location}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Residence:
                      </span>{" "}
                      {application.residenceType}
                    </p>

                    <p>
                      <span className="font-semibold">House:</span>{" "}
                      {application.houseType}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Pet Friendly:
                      </span>{" "}
                      {application.petFriendly ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="font-semibold mb-1">
                      About Applicant
                    </p>

                    <p className="text-gray-600">
                      {application.aboutYou}
                    </p>
                  </div>

                  <p className="text-gray-400 text-sm mt-5">
                    Application ID: {application._id}
                  </p>

                  {application.status === "pending" && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "adoption",
                            application._id,
                            "selected"
                          )
                        }
                        className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded"
                      >
                        Select
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "adoption",
                            application._id,
                            "rejected"
                          )
                        }
                        className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-saira font-bold mb-4">
            Foster Applications
          </h3>

          <div className="border-t border-gray-300 mb-6"></div>

          {fosterApplications.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500 font-saira">
                No foster applications received
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {fosterApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={application.pet?.image}
                      alt={application.pet?.petName}
                      className="w-full md:w-40 h-40 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <h4 className="text-2xl font-saira font-bold">
                        {application.pet?.petName}
                      </h4>

                      <p className="text-gray-500 mt-1">
                        {application.pet?.gender},{" "}
                        {application.pet?.age} year
                        {application.pet?.age !== 1 ? "s" : ""}
                      </p>

                      <p className="text-gray-500">
                        Location: {application.pet?.location}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-semibold capitalize ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status || "pending"}
                      </span>
                    </div>
                  </div>

                  <hr className="my-6" />

                  <h4 className="text-xl font-saira font-bold mb-4">
                    Applicant Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {application.fullName ||
                        application.adopter?.userName}
                    </p>

                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {application.email ||
                        application.adopter?.emailId}
                    </p>

                    {application.phone && (
                      <p>
                        <span className="font-semibold">
                          Phone:
                        </span>{" "}
                        {application.phone}
                      </p>
                    )}

                    {application.age && (
                      <p>
                        <span className="font-semibold">Age:</span>{" "}
                        {application.age}
                      </p>
                    )}

                    {application.currentProfession && (
                      <p>
                        <span className="font-semibold">
                          Profession:
                        </span>{" "}
                        {application.currentProfession}
                      </p>
                    )}

                    {application.location && (
                      <p>
                        <span className="font-semibold">
                          Location:
                        </span>{" "}
                        {application.location}
                      </p>
                    )}

                    {application.residenceType && (
                      <p>
                        <span className="font-semibold">
                          Residence:
                        </span>{" "}
                        {application.residenceType}
                      </p>
                    )}

                    {application.houseType && (
                      <p>
                        <span className="font-semibold">
                          House:
                        </span>{" "}
                        {application.houseType}
                      </p>
                    )}

                    {application.petFriendly !== undefined && (
                      <p>
                        <span className="font-semibold">
                          Pet Friendly:
                        </span>{" "}
                        {application.petFriendly ? "Yes" : "No"}
                      </p>
                    )}
                  </div>

                  {application.aboutYou && (
                    <div className="mt-5">
                      <p className="font-semibold mb-1">
                        About Applicant
                      </p>

                      <p className="text-gray-600">
                        {application.aboutYou}
                      </p>
                    </div>
                  )}

                  <p className="text-gray-400 text-sm mt-5">
                    Application ID: {application._id}
                  </p>

                  {application.status === "pending" && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "foster",
                            application._id,
                            "selected"
                          )
                        }
                        className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded"
                      >
                        Select
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "foster",
                            application._id,
                            "rejected"
                          )
                        }
                        className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShelterProfile;

