"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";

function UserOptions({ username }) {
  const router = useRouter();

  const handleSignOutClick = () => {
    signOut();
    router.refresh();
  };

  return (
    <>
      <Link
        href={`/profile/${username}`}
        className="text-sm md:text-base font-normal transition-colors text-[#c4c3c3] hover:text-white"
      >
        {username}
      </Link>
      <button
        onClick={handleSignOutClick}
        className="btn text-xs md:text-sm rounded-sm px-4 py-2 transition-colors"
      >
        sign out
      </button>
    </>
  );
}

function DefaultOptions() {
  return (
    <>
      <Link
        href="/signin"
        className="btn text-xs md:text-sm rounded-sm px-4 py-2 transition-colors"
      >
        sign in
      </Link>
      <Link
        href="/signup"
        className="btn text-xs md:text-sm rounded-sm px-4 py-2 transition-colors"
      >
        sign up
      </Link>
    </>
  );
}

export default function NavBarOptions({ username }) {
  if (username) {
    return <UserOptions username={username} />;
  }
  return <DefaultOptions />;
}
