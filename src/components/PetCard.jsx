
import React from "react";
import { Link } from "react-router-dom";

const PetCard = ({ pet, isAdopter = false }) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1552053831-71594a27632d";

  if (!pet) {
    return (
      <div className="card bg-base-100 w-full max-w-96 shadow-lg">
        <figure className="px-6 pt-6">
          <img
            src={defaultImage}
            alt="No pets available"
            className="rounded-xl h-52 w-full object-cover"
          />
        </figure>

        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl">No pets available</h2>
          <p className="text-gray-500">No pets available right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 w-full max-w-96 shadow-lg">
      <figure className="px-6 pt-6">
        <img
          src={pet.images?.[0] || defaultImage}
          alt={pet.petName || "Pet"}
          className="rounded-xl h-52 w-full object-cover"
        />
      </figure>

      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl">{pet.petName}</h2>

        <p>
          {pet.gender}
          {pet.age && (
            <>
              , <span>{pet.age}</span>
            </>
          )}
        </p>

        <p>{pet.breed}</p>
        <p>{pet.location}</p>
        <p>{pet.about}</p>

        <div className="w-full">
          <p className="text-xl font-semibold mb-2">Contact Details</p>

          <p>
            <span className="font-semibold">Name:</span>{" "}
            {pet.ownerName || pet.shelter?.userName || "N/A"}
          </p>

          <p>
            <span className="font-semibold">Number:</span>{" "}
            {pet.contactNumber || pet.shelter?.phoneNumber || "N/A"}
          </p>

          <p>
            <span className="font-semibold">Email:</span>{" "}
            {pet.ownerEmail || pet.shelter?.emailId || "N/A"}
          </p>
        </div>

        <hr className="w-full border border-red-500" />

        {isAdopter ? (
          <div className="w-full flex flex-col gap-3">
            <Link
              to={`/petdetails/${pet._id}`}
              className="link link-error no-underline hover:underline"
            >
              See More Details
            </Link>

            <div className="flex gap-3 justify-center">
              <Link
                to={`/fosterapplication/${pet._id}`}
                className="btn bg-blue-600 text-white hover:bg-blue-500"
              >
                Foster
              </Link>

              <Link
                to={`/adoptionapplication/${pet._id}`}
                className="btn bg-red-600 text-white hover:bg-red-500"
              >
                Adopt
              </Link>
            </div>
          </div>
        ) : (
          <Link
            to={`/petform/${pet._id}`}
            className="link link-error no-underline hover:underline"
          >
            Edit Pet
          </Link>
        )}
      </div>
    </div>
  );
};

export default PetCard;



