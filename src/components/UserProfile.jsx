import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const statusColors = {
  selected: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

function ApplicationCard({ application, type, meetings, onMeetingAction, busyId }) {
  const meeting = meetings.find(
    (m) =>
      (m.application?._id || m.application) === application._id &&
      m.applicationType === (type === "adoption" ? "AdoptionApplication" : "FosterApplication") &&
      m.status !== "cancelled"
  );
  const canRespond = meeting?.status === "proposed";
  const canRequestReschedule = ["proposed", "confirmed"].includes(meeting?.status);

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-5">
        <div>
          <h3 className="text-xl font-saira font-bold">{application.pet?.petName || "Pet"}</h3>
          <p className="text-gray-600 mt-2">Application ID: {application._id}</p>
          <p className="text-gray-500 mt-2">
            Applied on: {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <span className={`self-start px-4 py-2 rounded-full font-semibold capitalize ${statusColors[application.status] || statusColors.pending}`}>
          {application.status || "pending"}
        </span>
      </div>

      {meeting && (
        <div className="mt-5 p-4 rounded-lg border border-red-200 bg-red-50">
          <h4 className="font-bold text-lg mb-2">Meet &amp; Greet</h4>
          <p><strong>Status:</strong> <span className="capitalize">{meeting.status.replaceAll("_", " ")}</span></p>
          <p><strong>Date:</strong> {new Date(meeting.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
          <p><strong>Location:</strong> {meeting.location}</p>
          {meeting.notes && <p><strong>Notes:</strong> {meeting.notes}</p>}
          {(canRespond || canRequestReschedule) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {canRespond && (
                <button disabled={busyId === meeting._id} onClick={() => onMeetingAction(meeting._id, "confirm")}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">Confirm</button>
              )}
              {canRequestReschedule && (
                <button disabled={busyId === meeting._id} onClick={() => onMeetingAction(meeting._id, "request-reschedule")}
                  className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">Request Reschedule</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UserProfile() {
  const [user, setUser] = useState({ userName: "", emailId: "", phone: "" });
  const [applications, setApplications] = useState({ adoption: [], foster: [] });
  const [meetings, setMeetings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadData = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      setError("");
      const [profile, adoption, foster, meetingResponse] = await Promise.all([
        axios.get("/adoption/profile", { withCredentials: true }),
        axios.get("/adoption/applications", { withCredentials: true }),
        axios.get("/adoption/foster/applications", { withCredentials: true }),
        axios.get("/meet-and-greet/my-meetings", { withCredentials: true }),
      ]);
      setUser(profile.data.user || { userName: "", emailId: "", phone: "" });
      setApplications({
        adoption: adoption.data.applications || [],
        foster: foster.data.applications || [],
      });
      setMeetings(meetingResponse.data.meetings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load profile information");
    } finally {
      if (initial) setLoading(false);
    }
  };

  useEffect(() => { loadData(true); }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { data } = await axios.patch("/adoption/profile", {
        userName: user.userName,
        emailId: user.emailId,
        phone: user.phone,
      }, { withCredentials: true });
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        alert("Profile updated successfully");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleMeetingAction = async (id, action) => {
    try {
      setBusyId(id);
      await axios.patch(`/meet-and-greet/${id}/${action}`, {}, { withCredentials: true });
      await loadData();
      alert(action === "confirm" ? "Meeting confirmed" : "Reschedule request sent to shelter");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update meeting");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 flex justify-center items-center"><span className="loading loading-spinner loading-lg" /></div>;

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 bg-red-100">
      <Link to="/userfeed" className="inline-block bg-red-500 mt-8 text-white p-2 m-4 rounded-sm">Back</Link>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-red-500 font-righteous">My Profile</h1>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button disabled={saving} onClick={saveProfile} className="bg-green-600 text-white px-5 py-2 rounded-sm disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
                <button disabled={saving} onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-5 py-2 rounded-sm">Cancel</button>
              </>
            ) : <button onClick={() => setIsEditing(true)} className="bg-red-500 text-white px-5 py-2 rounded-sm">Edit</button>}
          </div>
        </div>
        {error && <div className="bg-white text-red-600 p-4 rounded-lg mb-6">{error} <button onClick={() => loadData()} className="underline ml-3">Retry</button></div>}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-5">
          {[["Name", "userName", "text"], ["Contact Number", "phone", "tel"], ["Email ID", "emailId", "email"]].map(([label, key, type]) => (
            <label key={key} className="block font-saira font-semibold">
              {label}
              <input type={type} name={key} value={user[key] || ""} disabled={!isEditing}
                onChange={(e) => setUser((prev) => ({ ...prev, [key]: e.target.value }))}
                className="input input-bordered w-full mt-2" />
            </label>
          ))}
        </div>

        {["adoption", "foster"].map((type) => (
          <section key={type} className="mt-12">
            <h2 className="text-3xl text-red-500 font-righteous mb-6 capitalize">{type} Application Status</h2>
            {applications[type].length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-white text-gray-500">
                You haven't submitted any {type} applications yet.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {applications[type].map((application) => (
                  <ApplicationCard key={application._id} application={application} type={type}
                    meetings={meetings} onMeetingAction={handleMeetingAction} busyId={busyId} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}