import Link from "next/link"

function Navbar() {
  return (
    <div className="p-5 mb-4 text-xl lg:py-10 lg:px-10 flex gap-5 items-center justify-center lg:text-2xl border-2 border-slate-400 rounded-xl">
      
      <Link href="/">
          <h1 className="font-bold">SSU Mess Feedback</h1>
      </Link>
      <Link className="underline text-nowrap" href="/form/1">Give Feedback</Link>
    </div>
  )
}

export default Navbar;