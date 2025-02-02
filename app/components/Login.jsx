"use client";

import { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if the user is already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;

      // Validate email domain
      if (!signedInUser.email.endsWith("@srisriuniversity.edu.in")) {
        throw new Error("Only university email addresses are allowed.");
      }

      setUser(signedInUser); // Update state with user info
      router.push("/"); // Redirect to homepage
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/"); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center p-4 flex-col border rounded shadow-md max-w-md mt-6">
      {!user ? <p className="text-sm font-semibold mb-4">Use University Email ID</p> : null}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!user ? (
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="text-white bg-gray-500 py-2 text-lg px-4 rounded w-full"
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      ) : (
        <button
          onClick={handleSignOut}
          className="bg-white text-black border-2 border-gray-500 py-2 px-4 text-lg rounded w-full mt-4"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
