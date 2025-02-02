// "use client";

// import { useState } from "react";
// // import { db } from "@/lib/firebase"; // Import Firebase setup
// // import { collection, addDoc } from "firebase/firestore";

// export default function MyForm({ id }) {
//   const [generalFeedback, setGeneralFeedback] = useState("");
//   const [ratings, setRatings] = useState({ item1: 0, item2: 0, item3: 0 });
//   const [submitted, setSubmitted] = useState(false);
//   const foodItems = ["Aloo Gobi", "Yellow Daal", "Roti"];

//   const handleRatingChange = (item, value) => {
//     setRatings({ ...ratings, [item]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Submit to Firebase
//       await addDoc(collection(db, "feedback"), {
//         id,
//         generalFeedback,
//         ratings,
//         timestamp: new Date(),
//       });
//       setSubmitted(true);
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };

//   if (submitted) {
//     return <h1 className="text-xl text-green-500">Thank you for your feedback!</h1>;
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col gap-4 p-6 bg-white rounded lg:w-[400px] max-w-[500px] min-w-[300px]"
//     >
//       <h2 className="text-lg font-bold">General Feedback</h2>
//       <textarea
//         value={generalFeedback}
//         onChange={(e) => setGeneralFeedback(e.target.value)}
//         placeholder="Share your thoughts..."
//         className="border p-2 rounded w-full"
//       />

//       <h2 className="text-lg font-bold">Rate Food Items</h2>
//       <div className="flex flex-col gap-4">

//         {foodItems.map((item) => (

//           <div key={item} className="flex justify-between items-center">
//             <span>{item}</span>

//             <div className="flex gap-2">
              
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => handleRatingChange(item, star)}
//                   className={`text-xl ${
//                     ratings[item] >= star ? "text-yellow-500" : "text-gray-400"
//                   }`}
//                 >
//                   ★
//                 </button>
//               ))}

//             </div>
//           </div>
//         ))}

//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//       >
//         Submit Feedback
//       </button>
//     </form>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { auth, db } from "@/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function MyForm({ id }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const onSubmit = async (data) => {
    if (!user) return alert("Please log in to submit feedback.");
    setLoading(true);

    const mealType = id.split("-").pop(); // Extract meal type from id
    const docRef = doc(db, "feedback", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().submittedBy?.[user.uid]) {
      setLoading(false);
      return alert("You have already submitted feedback for this meal.");
    }

    const feedbackData = {
      mealType,
      date: id.split("-")[0], // Extract date from id
      foodItems: {},
      generalQuestions: { [user.uid]: data.generalQuestions },
      submittedBy: { [user.uid]: true }
    };

    Object.keys(data.foodItems).forEach((item) => {
      feedbackData.foodItems[item] = {
        ratings: { [user.uid]: parseInt(data.foodItems[item].rating) },
        suggestions: { [user.uid]: data.foodItems[item].suggestion }
      };
    });

    await setDoc(docRef, feedbackData, { merge: true });
    setLoading(false);
    alert("Feedback submitted successfully!");
    router.push("/");
  };

  // Handle rating change
  const handleRatingChange = (item, value) => {
    setValue(`foodItems.${item}.rating`, value); // Update react-hook-form value
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4 w-full max-w-xl">
      <h2 className="text-2xl font-bold">Feedback Form</h2>
      
      {/* Food Items */}
      {["Idli", "Sambhar", "Rice", "Dal"].map((item) => (
        <div key={item} className="border p-3 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">{item}</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(item, star)}
                className={`text-3xl ${star <= (errors.foodItems?.[item]?.rating || 0) ? "text-yellow-500" : "text-gray-400"}`}
              >
                ★
              </button>
            ))}
          </div>
          {errors.foodItems?.[item]?.rating && <p className="text-red-500">Rating is required</p>}
          
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
