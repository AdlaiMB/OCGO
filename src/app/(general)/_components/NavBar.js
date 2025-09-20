import { auth } from "@/auth";

import Link from "next/link";

import NavBarOptions from "./NavBarOptions";

export default async function NavBar() {
  const session = await auth();

  return (
    <div id="NavBar" className="navbar px-10 py-4">
      <div className="text-4xl font-bold">
        <span className="text-[#E8963A]">OC</span>
        <span className="text-[#4B8E5A]">GO</span>
      </div>
      <Link
        href="/search"
        className="ml-10 font-normal transition-colors text-[#c4c3c3] hover:text-white"
      >
        search
      </Link>
      <div className="flex items-center gap-4 ml-auto">
        <NavBarOptions username={session ? session.user.name : null} />
      </div>
    </div>
  );
}
