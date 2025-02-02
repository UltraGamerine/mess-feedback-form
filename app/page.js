import Image from "next/image";
import Login from "./components/Login";

export default function Home() {
  return (
  
      <div className="h-[80vh] shadow-[rgba(0,0,15,0.5)_3px_3px_2px_0px] mb-10 p-4 text-3xl flex flex-col items-center rounded-xl border-2 border-slate-400">
      Welcome
      <Login/>
      </div>
  );
}
