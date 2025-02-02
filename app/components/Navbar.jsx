"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { CheckCircle } from "lucide-react";

function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = { timeZone: "Asia/Kolkata" };
    const now = new Date(new Date().toLocaleString("en-US", options));
    const currMinutes = now.getHours() * 60 + now.getMinutes();

    // Define meal times
    const meals = [
      { name: "breakfast", start: 7 * 60 + 45, end: 10 * 60 + 30 },
      { name: "lunch", start: 12 * 60 + 45, end: 15 * 60 },
      { name: "dinner", start: 19 * 60 + 45, end: 22 * 60 + 30 },
    ];

    let meal = "other";
    for (const m of meals) {
      if (currMinutes >= m.start && currMinutes <= m.end) {
        meal = m.name;
        break;
      }
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

      {user && 
        <span>
        <CheckCircle className="text-green-500 w-6 h-6" />
        </span>
      }

      <button
        className="bg-black text-sm text-white py-2 px-4 rounded-md text-nowrap"
        onClick={handleSubmit}
      >
        Give Feedback
      </button>

    </div>
  );
}

export default Navbar;
