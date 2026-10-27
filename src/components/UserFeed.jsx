
import React, { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "./PetCard";

const UserFeed = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const response = await axios.get(
        "/adoption/userfeed",
        { withCredentials: true }
      );

      if (response.data.success) {
        setPets(response.data.pets || []);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      pet.petName?.toLowerCase().includes(searchText) ||
      pet.breed?.toLowerCase().includes(searchText);

    const petAge = Number(pet.age);

    const matchesAge =
      !age ||
      (age === "young" && petAge >= 0 && petAge <= 3) ||
      (age === "adult" && petAge > 3 && petAge <= 12) ||
      (age === "senior" && petAge > 12);

 const locationText = location.toLowerCase().trim();

const matchesLocation =
  !locationText ||
  pet.location?.toLowerCase().includes(locationText) ||
  pet.city?.toLowerCase().includes(locationText);

 const petRating = Number(pet.ratingAverage || 0);
const ratingCount = Number(pet.ratingCount || 0);

const matchesRating =
  !rating ||
  (rating === "unrated" && ratingCount === 0) ||
  (rating !== "unrated" &&
    ratingCount > 0 &&
    petRating >= Number(rating));

    return (
      matchesSearch &&
      matchesAge &&
      matchesLocation &&
      matchesRating
    );
  });

  const clearFilters = () => {
    setSearch("");
    setAge("");
    setLocation("");
    setRating("");
  };

  return (
    <div className="min-h-screen pt-24 px-6 bg-red-100">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by pet name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full md:w-1/4"
        />

        <select
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="select select-bordered w-full md:w-36"
        >
          <option value="">All Ages</option>
          <option value="young">0-3 years</option>
          <option value="adult">4-12 years</option>
          <option value="senior">Above 12 years</option>
        </select>

        <input
          type="text"
          placeholder="Search location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input input-bordered w-full md:w-44"
        />

    
<select
  value={rating}
  onChange={(e) => setRating(e.target.value)}
  className="select select-bordered w-full md:w-40"
>
  <option value="">All Ratings</option>
  <option value="5">5 Stars</option>
  <option value="4">4+ Stars</option>
  <option value="3">3+ Stars</option>
  <option value="2">2+ Stars</option>
  <option value="1">1+ Stars</option>
  <option value="unrated">Not Yet Rated</option>
</select>


        <button
          onClick={clearFilters}
          className="btn bg-red-600 text-white hover:bg-red-500 w-full md:w-auto"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading pets...</p>
      ) : filteredPets.length === 0 ? (
        <p className="text-center text-gray-500">
          No pets found
        </p>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              isAdopter
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFeed;
