"use client";

import MyForm from "@/app/components/MyForm";
import { useState, useEffect } from "react";

export default function Form({ params: paramsPromise }) {
  const [params, setParams] = useState(null);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Unwrap params
    paramsPromise.then((resolvedParams) => {
      setParams(resolvedParams);
    });

    const calculateGreeting = () => {
      const now = new Date();
      const options = { timeZone: "Asia/Kolkata" };
      const gmtTime = new Date(
        now.toLocaleString("en-US", { ...options, timeZoneName: "short" })
      );
      const currMinutes = gmtTime.getHours() * 60 + gmtTime.getMinutes();

      const morningStart = 7 * 60 + 45; // 7:45 AM
      const morningEnd = 10 * 60 + 30; // 10:30 AM
      const afternoonStart = 12 * 60 + 45; // 12:45 PM
      const afternoonEnd = 15 * 60; // 3:00 PM
      const eveningStart = 19 * 60 + 45; // 7:45 PM
      const eveningEnd = 22 * 60 + 30; // 10:30 PM

      if (currMinutes >= morningStart && currMinutes <= morningEnd) {
        return "Good Morning!";
      } else if (currMinutes >= afternoonStart && currMinutes <= afternoonEnd) {
        return "Good Afternoon!";
      } else if (currMinutes >= eveningStart && currMinutes <= eveningEnd) {
        return "Good Evening!";
      } else {
        return "Hi! Feedback Form will be available soon...";
      }
    };

    // Update time, date, and greeting every second
    const interval = setInterval(() => {
      const now = new Date();
      const timeOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const dateOptions = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
      const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);

      setTime(timeFormatter.format(now)); // Update formatted time
      setDate(dateFormatter.format(now)); // Update formatted date
      setGreeting(calculateGreeting()); // Update greeting
    },1000);

    return () => clearInterval(interval); // Clean up on component unmount
  }, [paramsPromise]);

  if (!params) {
    return <div>Loading...</div>; // Show a loading state while params are being resolved
  }

  return (
    <div className="flex px-10 flex-col h-[80vh] shadow-[rgba(0,0,15,0.5)_3px_3px_2px_0px] items-center pt-10 gap-4 border-2 border-slate-400 rounded-xl">
      <h1 className="text-xl font-black-100">Form: {params.id}</h1>
      <h1 className="text-black-600 text-xl">{date} | {time}</h1>
      <h1 className="text-3xl text-violet-400 px-10">{greeting}</h1>
      <MyForm id={params.id}/>
    </div>
  );
}
