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
      <Link href={`/profile/${username}`} className="font-normal">
        {" "}
        {username}{" "}
      </Link>
      <button
        onClick={handleSignOutClick}
        className="btn text-sm rounded-sm px-4 py-2 transition-colors"
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
        className="btn text-sm rounded-sm px-4 py-2 transition-colors"
      >
        sign in
      </Link>
      <Link
        href="/signup"
        className="btn text-sm rounded-sm px-4 py-2 transition-colors"
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
