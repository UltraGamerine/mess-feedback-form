"use client";

import { useState } from "react";
// import { db } from "@/lib/firebase"; // Import Firebase setup
// import { collection, addDoc } from "firebase/firestore";

export default function MyForm({ id }) {
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [ratings, setRatings] = useState({ item1: 0, item2: 0, item3: 0 });
  const [submitted, setSubmitted] = useState(false);
  const foodItems = ["Aloo Gobi", "Yellow Daal", "Roti"];

  const handleRatingChange = (item, value) => {
    setRatings({ ...ratings, [item]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit to Firebase
      await addDoc(collection(db, "feedback"), {
        id,
        generalFeedback,
        ratings,
        timestamp: new Date(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (submitted) {
    return <h1 className="text-xl text-green-500">Thank you for your feedback!</h1>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded lg:w-[400px] max-w-[500px] min-w-[300px]"
    >
      <h2 className="text-lg font-bold">General Feedback</h2>
      <textarea
        value={generalFeedback}
        onChange={(e) => setGeneralFeedback(e.target.value)}
        placeholder="Share your thoughts..."
        className="border p-2 rounded w-full"
      />

      <h2 className="text-lg font-bold">Rate Food Items</h2>
      <div className="flex flex-col gap-4">

        {foodItems.map((item) => (

          <div key={item} className="flex justify-between items-center">
            <span>{item}</span>

            <div className="flex gap-2">
              
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(item, star)}
                  className={`text-xl ${
                    ratings[item] >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </button>
              ))}

            </div>
          </div>
        ))}

      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Submit Feedback
      </button>
    </form>
  );
}
