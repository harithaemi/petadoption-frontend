import React, { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "./PetCard";
import { Link, useLocation } from "react-router-dom";

const Feed = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const getMyPets = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/shelter/feed",
        {
          withCredentials: true,
        }
      );

      console.log("Updated pets from backend:", response.data);

      if (response.data.success) {
        setPets(response.data.pets || []);
      }
    } catch (error) {
      console.error(
        "Error fetching pets:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyPets();
  }, [location.key]);

  return (
    <div className="min-h-screen pt-24 px-6 pb-10">

      <div className="flex justify-center mb-8">
        <Link
          to="/petform"
          className="btn md:w-1/4 w-1/2 bg-red-600 text-white hover:bg-red-500"
        >
          Create Pet
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : pets.length === 0 ? (
        <div className="flex justify-center">
          <PetCard />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {pets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Feed;
