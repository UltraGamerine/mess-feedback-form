"use client";

import { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Handle Google Sign-In
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Trigger Google Sign-In popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Validate email domain
      if (!user.email.endsWith("@srisriuniversity.edu.in")) {
        throw new Error("Only university email addresses are allowed.");
      }

      // You can access user information here (e.g. user.uid, user.email)
      console.log(user);

      // Redirect after successful login
      router.push("/"); // Redirect to your dashboard or home page
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/"); // Redirect to login page after sign-out
  };
  return (
      <div className="flex justify-center items-center p-4 flex-col border rounded shadow-md max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="bg-blue-500 text-white py-2 text-lg px-4 rounded w-full"
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {/* Sign out button for testing purposes */}
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white py-2 px-4 text-lg rounded w-full mt-4"
        >
          Sign Out
        </button>
      </div>
  );
}
