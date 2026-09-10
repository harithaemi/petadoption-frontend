import React, { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "./PetCard";

const UserFeed = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7777/adoption/userfeed",
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
    const searchText = search.toLowerCase();

    const matchesSearch =
      pet.petName?.toLowerCase().includes(searchText) ||
      pet.breed?.toLowerCase().includes(searchText);

    const matchesAge =
      !age ||
      (age === "puppy" && pet.age >= 1 && pet.age <= 3) ||
      (age === "adult" && pet.age > 3 && pet.age <= 12);

    return matchesSearch && matchesAge;
  });

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by puppy name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full md:w-1/4"
        />

        <select
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="select select-bordered w-full md:w-30"
        >
          <option value="">Age</option>
          <option value="puppy">1-3</option>
          <option value="adult">3-12</option>
        </select>

        <button
          onClick={() => {
            setSearch(search);
            setAge(age);
          }}
          className="btn bg-red-600 text-white hover:bg-red-500 w-full md:w-auto"
        >
          Search
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
    <PetCard key={pet._id} pet={pet} isAdopter />
  ))}
</div>
      )}
    </div>
  );
};

export default UserFeed;
