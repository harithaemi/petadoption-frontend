import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import PetCard from "./PetCard";

const PetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    petName: "",
    gender: "",
    age: "",
    location: "",
    ownerName: "",
    contactNumber: "",
    breed: "",
    status: "available",
    ownerEmail: "",
    city: "",
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    if (selectedImages.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }

    setImages(selectedImages);
  };

  const getPet = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:7777/shelter/feed",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const pets = response.data.pets || [];
        const pet = pets.find((item) => item._id === id);

        if (!pet) {
          alert("Pet not found");
          navigate("/feed");
          return;
        }

        setFormData({
          petName: pet.petName || "",
          gender: pet.gender || "",
          age: pet.age || "",
          location: pet.location || "",
          ownerName: pet.ownerName || "",
          contactNumber: pet.contactNumber || "",
          breed: pet.breed || "",
          status: pet.status || "available",
          ownerEmail: pet.ownerEmail || "",
          city: pet.city || "",
          about: pet.about || "",
        });
      }
    } catch (error) {
      console.error(
        "Error getting pet:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      getPet();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("petName", formData.petName);
      data.append("gender", formData.gender);
      data.append("age", formData.age);
      data.append("location", formData.location);
      data.append("ownerName", formData.ownerName);
      data.append("contactNumber", formData.contactNumber);
      data.append("breed", formData.breed);
      data.append("status", formData.status);
      data.append("ownerEmail", formData.ownerEmail);
      data.append("city", formData.city);
      data.append("about", formData.about);

      images.forEach((image) => {
        data.append("images", image);
      });

      let response;

      if (isEditMode) {
        response = await axios.patch(
          `http://localhost:7777/shelter/pet/${id}`,
          data,
          {
            withCredentials: true,
          }
        );
      } else {
        if (images.length === 0) {
          alert("Please select at least one image");
          setLoading(false);
          return;
        }

        response = await axios.post(
          "http://localhost:7777/shelter/pets",
          data,
          {
            withCredentials: true,
          }
        );
      }

      console.log("Pet response:", response.data);

      if (response.data.success) {
        alert(
          isEditMode
            ? "Pet updated successfully"
            : "Pet created successfully"
        );

        navigate("/feed");
      }
    } catch (error) {
      console.error(
        "Save pet error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const previewPet = {
    ...formData,
    image: images.length > 0
      ? URL.createObjectURL(images[0])
      : undefined,
  };

  return (
    <div className="mt-20 flex flex-col lg:flex-row justify-center items-start gap-8 px-4 pb-10">
      <Link to="/feed">
        <button
          type="button"
          className="bg-red-500 mt-8 cursor-pointer text-white p-2 m-4 rounded-sm"
        >
          Back
        </button>
      </Link>

      <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-4xl md:text-5xl text-red-600 mb-8 font-saira text-center">
          {isEditMode ? "Edit Pet" : "Create Pet"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-y-4">
            <div className="w-full md:w-1/2 px-2">
              <label className="text-red-500 text-sm">Pet Name</label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                placeholder="Enter the pet name"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
                required
              />
            </div>

            <div className="w-full md:w-1/4 px-2">
              <label className="text-red-500 text-sm">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border-red-100 p-2 rounded-lg border-2 w-full"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="w-full md:w-1/4 px-2">
              <label className="text-red-500 text-sm">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
                required
              />
            </div>

            <div className="w-full md:w-1/2 px-2">
              <label className="text-red-500 text-sm">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter pet location"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
              />
            </div>

            <div className="w-full md:w-1/2 px-2">
              <label className="text-red-500 text-sm">Pet Owner</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Enter owner name"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
              />
            </div>

            <div className="w-full md:w-1/2 px-2">
              <label className="text-red-500 text-sm">Mobile Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
              />
            </div>

            <div className="w-full md:w-1/2 px-2">
              <label className="text-red-500 text-sm">Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Dog breed"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
              />
            </div>

            <div className="w-full md:w-1/3 px-2">
              <label className="text-red-500 text-sm">Availability</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border-red-100 p-2 rounded-lg border-2 w-full"
                required
              >
                <option value="available">Available</option>
                <option value="adopted">Adopted</option>
                <option value="fostered">Fostered</option>
              </select>
            </div>

            <div className="w-full md:w-1/3 px-2">
              <label className="text-red-500 text-sm">Owner Email</label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="Email"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
              />
            </div>

            <div className="w-full md:w-1/3 px-2">
              <label className="text-red-500 text-sm">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border-red-100 p-2 rounded-lg border-2 w-full"
              />
            </div>

            <div className="w-full px-2">
              <label className="text-red-500 text-sm">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us about the pet..."
                className="border-red-100 p-2 rounded-lg border-2 w-full resize-none"
              />
            </div>

            <div className="w-full px-2">
              <label className="text-red-500 text-sm">
                Upload Pictures
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="border-red-100 p-2 rounded-lg border-2 w-full"
                required={!isEditMode}
              />

              <p className="text-gray-500 text-sm mt-1">
                You can upload up to 5 images
              </p>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Pet ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full px-2 mt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-10 py-3 rounded-lg hover:bg-red-500 transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Pet"
                  : "Save Pet"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full lg:w-1/3 flex justify-center lg:sticky lg:top-10">
        <PetCard pet={previewPet} />
      </div>
    </div>
  );
};

export default PetForm;