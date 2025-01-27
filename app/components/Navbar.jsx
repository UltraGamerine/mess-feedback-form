import Link from "next/link"

function Navbar() {
  return (
    <div className="py-5 px-5 text-xl lg:py-10 lg:px-10 flex gap-10 items-center justify-center lg:text-2xl bg-sky-300">
      
      <Link href="/">
          <h1 className="font-bold">SSU Mess Feedback</h1>
      </Link>
      <Link className="underline" href="/form/1">Give Feedback</Link>
    </div>
  )
}

export default Navbar