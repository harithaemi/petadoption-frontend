import React, { useEffect, useState } from "react";
import axios from "axios";

const initialMeeting = { date: "", location: "", notes: "" };

const statusStyle = {
  selected: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const fields = [
  ["Name", (a) => a.fullName || a.adopter?.userName],
  ["Email", (a) => a.email || a.adopter?.emailId],
  ["Phone", (a) => a.phone],
  ["Age", (a) => a.age],
  ["Profession", (a) => a.currentProfession],
  ["Location", (a) => a.location],
  ["Residence", (a) => a.residenceType],
  ["House", (a) => a.houseType],
  ["Pet Friendly", (a) => a.petFriendly == null ? null : a.petFriendly ? "Yes" : "No"],
];

function ApplicationCard({ application: a, type, meeting, onStatus, onSchedule }) {
  const pending = a.status === "pending";
  const canSchedule = pending && a.pet?.status === "available" && !meeting;
  const pet = a.pet || {};

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {pet.image && (
          <img src={pet.image} alt={pet.petName || "Pet"} className="w-full md:w-40 h-40 object-cover rounded-xl" />
        )}
        <div className="flex-1">
          <h4 className="text-2xl font-saira font-bold">{pet.petName || "Pet unavailable"}</h4>
          <p className="text-gray-500 mt-1">{pet.gender}, {pet.age} year{pet.age === 1 ? "" : "s"}</p>
          <p className="text-gray-500">Location: {pet.location}</p>
          {pet.about && <p className="text-gray-600 mt-2">{pet.about}</p>}
        </div>
        <span className={`self-start px-4 py-2 rounded-full font-semibold capitalize ${statusStyle[a.status] || statusStyle.pending}`}>
          {a.status || "pending"}
        </span>
      </div>

      <hr className="my-6" />
      <h4 className="text-xl font-saira font-bold mb-4">Applicant Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([label, getValue]) => {
          const value = getValue(a);
          return value === undefined || value === null || value === "" ? null : (
            <p key={label}><span className="font-semibold">{label}:</span> {value}</p>
          );
        })}
      </div>
      {a.aboutYou && (
        <div className="mt-5">
          <p className="font-semibold mb-1">About Applicant</p>
          <p className="text-gray-600">{a.aboutYou}</p>
        </div>
      )}
      <p className="text-gray-400 text-sm mt-5">Application ID: {a._id}</p>

      {meeting && (
        <div className="mt-5 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="font-semibold">Meet & Greet — <span className="capitalize">{meeting.status.replaceAll("_", " ")}</span></p>
          <p>{new Date(meeting.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
          <p>{meeting.location}</p>
          {meeting.notes && <p className="text-gray-600">{meeting.notes}</p>}
        </div>
      )}

      {pending && (
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={() => onStatus(type, a._id, "selected")} className="bg-green-600 text-white px-5 py-2 rounded">Select</button>
          <button onClick={() => onStatus(type, a._id, "rejected")} className="bg-red-500 text-white px-5 py-2 rounded">Reject</button>
          {canSchedule && (
            <button onClick={() => onSchedule(a, type)} className="bg-black text-white px-5 py-2 rounded">
              Schedule Meet & Greet
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ShelterProfile() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState({ adoption: [], foster: [] });
  const [meetings, setMeetings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ userName: "", emailId: "" });
  const [selected, setSelected] = useState(null);
  const [meetingForm, setMeetingForm] = useState(initialMeeting);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError("");
      const [p, a, f, m] = await Promise.all([
        axios.get("/shelter/profile", { withCredentials: true }),
        axios.get("/shelter/applications/adoption", { withCredentials: true }),
        axios.get("/shelter/applications/foster", { withCredentials: true }),
        axios.get("/meet-and-greet/my-meetings", { withCredentials: true }),
      ]);
      const user = p.data.user;
      setProfile(user);
      setFormData({ userName: user?.userName || "", emailId: user?.emailId || "" });
      setApplications({
        adoption: a.data.applications || [],
        foster: f.data.applications || [],
      });
      setMeetings(m.data.meetings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load shelter profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateProfile = async () => {
    try {
      const { data } = await axios.patch("/shelter/profile", formData, { withCredentials: true });
      if (data.success) {
        setProfile(data.user);
        setEditing(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update profile");
    }
  };

  const updateStatus = async (type, id, status) => {
    try {
      await axios.patch(`/shelter/applications/${type}/${id}/status`, { status }, { withCredentials: true });
      await fetchData(false);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update application status");
    }
  };

  const scheduleMeeting = async (e) => {
    e.preventDefault();
    if (!selected || saving) return;
    setSaving(true);
    try {
      await axios.post("/meet-and-greet", {
        applicationId: selected.application._id,
        applicationType: selected.type === "adoption" ? "AdoptionApplication" : "FosterApplication",
        date: new Date(meetingForm.date).toISOString(),
        location: meetingForm.location.trim(),
        notes: meetingForm.notes.trim(),
      }, { withCredentials: true });
      setSelected(null);
      setMeetingForm(initialMeeting);
      await fetchData(false);
      alert("Meet & Greet invitation sent");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to schedule meeting");
    } finally {
      setSaving(false);
    }
  };

  const activeMeeting = (a, type) => meetings.find((m) =>
    (m.application?._id || m.application) === a._id &&
    m.applicationType === (type === "adoption" ? "AdoptionApplication" : "FosterApplication") &&
    ["proposed", "confirmed", "reschedule_requested"].includes(m.status)
  );

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading shelter profile...</div>;
  if (error) return (
    <div className="min-h-screen pt-24 text-center">
      <p className="text-red-500">{error}</p>
      <button onClick={() => fetchData()} className="mt-4 bg-black text-white px-5 py-2 rounded">Try Again</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-red-100 pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-saira font-bold">Shelter Profile</h2>
            {!editing && <button onClick={() => setEditing(true)} className="bg-black text-white px-5 py-2 rounded">Edit Profile</button>}
          </div>
          {editing ? (
            <div className="space-y-4">
              {["userName", "emailId"].map((field) => (
                <label key={field} className="block font-semibold">
                  {field === "userName" ? "Username" : "Email"}
                  <input type={field === "emailId" ? "email" : "text"} value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="border border-gray-300 rounded w-full p-3 mt-2" />
                </label>
              ))}
              <div className="flex gap-3">
                <button onClick={updateProfile} className="bg-green-600 text-white px-5 py-2 rounded">Save</button>
                <button onClick={() => setEditing(false)} className="bg-gray-300 px-5 py-2 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[["Username", profile?.userName], ["Email", profile?.emailId], ["Role", profile?.role]].map(([label, value]) => (
                <div key={label}><p className="text-gray-500 text-sm">{label}</p><p className="font-semibold text-lg">{value}</p></div>
              ))}
            </div>
          )}
        </div>

        {["adoption", "foster"].map((type) => (
          <section key={type} className="mb-10">
            <h3 className="text-2xl font-saira font-bold mb-4 capitalize">{type} Applications</h3>
            <div className="border-t border-gray-300 mb-6" />
            {applications[type].length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
                No {type} applications received
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {applications[type].map((a) => (
                  <ApplicationCard key={a._id} application={a} type={type}
                    meeting={activeMeeting(a, type)} onStatus={updateStatus}
                    onSchedule={(application, kind) => {
                      setSelected({ application, type: kind });
                      setMeetingForm(initialMeeting);
                    }} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={scheduleMeeting} className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-2xl font-bold">Schedule Meet & Greet</h3>
            <p className="text-gray-600">{selected.application.pet?.petName} — {selected.application.fullName}</p>
            <label className="block">Date & Time
              <input required type="datetime-local" value={meetingForm.date}
                min={(() => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); })()}
                onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                className="border rounded w-full p-3 mt-1" />
            </label>
            <label className="block">Location
              <input required value={meetingForm.location}
                onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                className="border rounded w-full p-3 mt-1" />
            </label>
            <label className="block">Notes (optional)
              <textarea value={meetingForm.notes}
                onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                className="border rounded w-full p-3 mt-1" rows={3} />
            </label>
            <div className="flex gap-3 justify-end">
              <button type="button" disabled={saving} onClick={() => setSelected(null)} className="bg-gray-200 px-5 py-2 rounded">Cancel</button>
              <button disabled={saving} className="bg-black text-white px-5 py-2 rounded disabled:opacity-50">
                {saving ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
