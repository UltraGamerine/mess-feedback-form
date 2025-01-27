"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = { timeZone: "Asia/Kolkata" };
    const now = new Date(new Date().toLocaleString("en-US", options));
    const currMinutes = now.getHours() * 60 + now.getMinutes();

    // Define time intervals in minutes
    const breakfastStart = 7 * 60 + 45; // 7:45 AM
    const breakfastEnd = 10 * 60 + 30; // 10:30 AM

    const lunchStart = 12 * 60 + 45; // 12:45 PM
    const lunchEnd = 15 * 60; // 3:00 PM

    const dinnerStart = 19 * 60 + 45; // 7:45 PM
    const dinnerEnd = 22 * 60 + 30; // 10:30 PM

    let meal;
    if (currMinutes >= breakfastStart && currMinutes <= breakfastEnd) {
      meal = "breakfast";
    } else if (currMinutes >= lunchStart && currMinutes <= lunchEnd) {
      meal = "lunch";
    } else if (currMinutes >= dinnerStart && currMinutes <= dinnerEnd) {
      meal = "dinner";
    } else {
      meal = "other"; // Outside meal times
    }

    const date = now.toISOString().split("T")[0];
    const uniqueId = `${date}-${meal}`;

    router.push(`/form/${uniqueId}`);
  };

  return (
    <div className="p-5 shadow-[rgba(0,0,15,0.5)_3px_3px_2px_0px] mb-4 text-xl lg:py-8 lg:px-10 flex gap-5 items-center justify-center lg:text-2xl border-2 border-slate-400 rounded-xl">
      <Link href="/">
        <h1 className="font-bold">SSU Mess Feedback</h1>
      </Link>

      <button
        className="bg-black text-white py-2 px-4 rounded-md text-nowrap"
        onClick={handleSubmit}
      >
        Give Feedback
      </button>
    </div>
  );
}

export default Navbar;
