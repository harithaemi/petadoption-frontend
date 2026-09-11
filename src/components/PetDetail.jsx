import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchPet = async () => {
    try {
      const response = await axios.get(
        `/adoption/pet/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log("PET DATA:", response.data.pet);
        setPet(response.data.pet);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `/reviews/${id}`
      );

      if (response.data.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMessage("");
    setReviewLoading(true);

    try {
      const response = await axios.post(
        "/reviews",
        {
          pet: id,
          rating,
          comment,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setReviewMessage("Review submitted successfully");
        setRating(5);
        setComment("");
        fetchReviews();
        fetchPet();
      }
    } catch (error) {
      setReviewMessage(
        error.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        Loading pet details...
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <p className="text-xl text-gray-500">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <Link to="/userfeed">
        <button className="bg-red-500 mt-8 cursor-pointer text-white p-2 m-4 rounded-sm">
          Back
        </button>
      </Link>

      <div className="text-center m-4">
        <h1 className="text-3xl md:text-5xl text-red-500 font-righteous">
          Make {pet.petName} part of your family
        </h1>

        <h2 className="mt-6 text-xl md:text-2xl font-saira">
          Hi!! I'm {pet.petName}, nice to meet you 👋
        </h2>
      </div>

<div className="flex justify-center mt-8">
  <div className="carousel w-full max-w-3xl rounded-xl">
    {(pet.images?.length ? pet.images : pet.image ? [pet.image] : []).map(
      (image, index, images) => (
        <div
          key={index}
          id={`slide${index}`}
          className="carousel-item relative w-full"
        >
          <img
            src={image}
            className="w-full h-80 md:h-113 object-cover"
            alt={`${pet.petName} ${index + 1}`}
          />

          {images.length > 1 && (
            <>
              <a
                href={`#slide${index === 0 ? images.length - 1 : index - 1}`}
                className="absolute left-5 top-1/2 -translate-y-1/2 btn btn-circle"
              >
                ❮
              </a>

              <a
                href={`#slide${index === images.length - 1 ? 0 : index + 1}`}
                className="absolute right-5 top-1/2 -translate-y-1/2 btn btn-circle"
              >
                ❯
              </a>
            </>
          )}
        </div>
      )
    )}
  </div>
</div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-3xl text-red-500 font-righteous mb-4">
          My Personality
        </h2>

        <p className="font-saira text-lg leading-8">
          {pet.about || "No personality information available."}
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-8 overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <tbody>
            <tr>
              <th>Breed</th>
              <td>{pet.breed || "N/A"}</td>
            </tr>
            <tr>
              <th>Age</th>
              <td>{pet.age || "N/A"}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{pet.gender || "N/A"}</td>
            </tr>
            <tr>
              <th>Pet ID</th>
              <td>{pet._id}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-3xl text-red-500 font-righteous mb-4">
          My Adoption Info
        </h2>

        <p className="font-saira text-lg leading-8">
          I am looking for a loving and responsible family who can provide me
          with a safe and comfortable home. Before adoption, please make sure
          that you are ready to take responsibility for my food, health,
          exercise and everyday care.
        </p>

        <p className="font-saira text-lg leading-8 mt-4">
          Please contact the shelter for vaccination records and other health
          information before completing the adoption process.
        </p>

        <p className="font-saira text-lg leading-8 mt-4">
          Please remember that adopting a pet is a long-term commitment.
          Give me patience, care and lots of love, and I will become a
          wonderful part of your family. ❤️
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-3xl text-red-500 font-righteous mb-6">
          Reviews
        </h2>

        <form
          onSubmit={submitReview}
          className="bg-gray-100 rounded-xl p-6 shadow-md"
        >
          <h3 className="text-xl font-bold mb-4">
            Give your review
          </h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="select select-bordered w-full mb-4"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very Good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Average</option>
            <option value={1}>1 - Poor</option>
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="textarea textarea-bordered w-full mb-4"
            rows="4"
          />

          <button
            type="submit"
            disabled={reviewLoading}
            className="bg-red-500 hover:bg-red-400 disabled:bg-gray-400 text-white px-6 py-2 rounded-sm"
          >
            {reviewLoading ? "Submitting..." : "Submit Review"}
          </button>

          {reviewMessage && (
            <p className="mt-3 text-gray-600">{reviewMessage}</p>
          )}
        </form>

        <div className="mt-8 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border rounded-xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="font-bold">
                    {review.user?.userName || "User"}
                  </h3>

                  <span className="text-yellow-500 font-bold">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="mt-2 text-gray-700">
                  {review.comment || "No comment"}
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-3xl text-red-500 font-righteous mb-6">
          Talk to Us
        </h2>

        <div className="bg-gray-100 rounded-xl p-6 shadow-md">
          <h3 className="text-2xl font-saira font-bold mb-4">
            Shelter Owner
          </h3>

          <div className="space-y-3 font-saira text-lg">
            <p>
              <span className="font-bold">Name:</span>{" "}
              {pet.shelter?.userName || "N/A"}
            </p>

            <p>
              <span className="font-bold">Email:</span>{" "}
              {pet.shelter?.emailId || "N/A"}
            </p>

            <p>
              <span className="font-bold">Location:</span>{" "}
              {pet.location || "N/A"}
            </p>

            <p>
              <span className="font-bold">Phone:</span>{" "}
              {pet.shelter?.phoneNumber || "N/A"}
            </p>
          </div>

          <Link
            to={`/chat/${pet._id}/${pet.shelter?._id}`}
            className="inline-block mt-6 bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-sm"
          >
            Contact Shelter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;


