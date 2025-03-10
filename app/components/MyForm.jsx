"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { auth, db } from "@/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function MyForm({ id }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  // Update rating when clicked
  const handleRatingChange = (item, value) => {
    setRatings((prev) => ({ ...prev, [item]: value })); // Update state
    setValue(`foodItems.${item}.rating`, value); // Sync with react-hook-form
  };

  const onSubmit = async (data) => {
    if (!user) return alert("Please log in to submit feedback.");
    setLoading(true);

    const mealType = id.split("-").pop(); // Extract meal type
    const date = id.split("-")[0]; // Extract date
    const docRef = doc(db, "feedback", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().submittedBy?.[user.uid]) {
      setLoading(false);
      return alert("You have already submitted feedback for this meal.");
    }

    // Construct feedback data
    const feedbackData = {
      mealType,
      date,
      foodItems: {},
      generalQuestions: { [user.uid]: data.generalQuestions },
      submittedBy: { [user.uid]: true }
    };

    // Store ratings & suggestions
    Object.keys(data.foodItems).forEach((item) => {
      feedbackData.foodItems[item] = {
        ratings: { ...docSnap.data()?.foodItems?.[item]?.ratings, [user.uid]: parseInt(data.foodItems[item].rating) },
        suggestions: { ...docSnap.data()?.foodItems?.[item]?.suggestions, [user.uid]: data.foodItems[item].suggestion }
      };
    });

    await setDoc(docRef, feedbackData, { merge: true });
    setLoading(false);
    alert("Feedback submitted successfully!");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4 w-full max-w-xl">
      <h2 className="text-2xl font-bold">Feedback Form</h2>

      {/* Food Items */}
      {["Idli", "Sambhar", "Rice", "Dal"].map((item) => (
        <div key={item} className="border p-3 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">{item}</h3>
          
          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(item, star)}
                className={`text-3xl ${star <= (ratings[item] || 0) ? "text-yellow-500" : "text-gray-400"}`}
              >
                ★
              </button>
            ))}
          </div>
          {errors.foodItems?.[item]?.rating && <p className="text-red-500">Rating is required</p>}
          
          {/* Suggestion Box */}
          <label>Suggestion:</label>
          <input type="text" {...register(`foodItems.${item}.suggestion`)} className="border p-2 w-full" />
        </div>
      ))}
      
      {/* General Questions */}
      <div className="border p-3 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold">General Questions</h3>
        <label>Was the meal hygienic?</label>
        <input type="text" {...register("generalQuestions.hygiene", { required: true })} className="border p-2 w-full" />
        {errors.generalQuestions?.hygiene && <p className="text-red-500">This is required</p>}
      </div>

      <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
