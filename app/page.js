import Image from "next/image";
import Link from "next/link"

export default function Home() {
  return (
    <>
      <div className="py-10 px-10 flex gap-10 items-center justify-center text-2xl bg-sky-300">
      <h1 className="">SSU Mess Feedback</h1>
      <Link className="underline" href="/form/1">Fill Forms</Link>
      </div>
    </>
  );
}
