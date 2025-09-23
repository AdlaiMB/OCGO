"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { serverActionDeleteUser } from "@/lib/actions";

export default function ProfileHeader({ name, bio, isSessionUsersProfile }) {
  const [modalDisplay, setModalDisplay] = useState(false);
  const router = useRouter();

  const handleDeleteClick = async () => {
    const response = await serverActionDeleteUser();

    if (!response.success) {
      console.log(response.error);
      return;
    }

    router.refresh();
    router.push("/search");
  };

  return (
    <div
      id="ProfileHeader"
      className="posts-container p-3 md:p-4 lg:p-6 gap-0 flex-row items-center justify-between"
    >
      <div id="ProfileImg">
        <div className="text-5xl flex items-center justify-center rounded-full w-[120px] h-[120px] md:w-[150px] md:h-[150px] border border-[#333333]">
          {name?.[0]}
        </div>
      </div>
      <div id="ProfileContent" className="w-[55%] md:w-[75%]">
        <div id="ProfileInfo">
          <h1 className="text-2xl md:text-3xl font-medium">{name}</h1>
          <p className="text-sm md:text-base font-normal">{bio}</p>
        </div>
        {isSessionUsersProfile && (
          <div
            id="ProfileActions"
            className="relative flex flex-row gap-2 mt-4"
          >
            <Link
              href="/update/profile"
              className="btn text-xs md:text-sm rounded-sm px-4 py-2 transition-colors"
            >
              edit
            </Link>
            <button
              onClick={() => setModalDisplay(!modalDisplay)}
              className="btn text-xs md:text-sm rounded-sm px-4 py-2 transition-colors"
            >
              delete
            </button>
            {modalDisplay && (
              <div className="w-[300px] dropdown-menu flex-col gap-2 absolute left-0 top-11 rounded-sm text-sm">
                <p>are you sure you want to delete the account?</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDeleteClick()}
                    className="rounded-sm px-2 py-1 transition-colors bg-green-800 hover:bg-green-500 cursor-pointer"
                  >
                    yes
                  </button>
                  <button
                    onClick={() => setModalDisplay(false)}
                    className="rounded-sm px-2 py-1 transition-colors bg-red-800 hover:bg-red-500 cursor-pointer"
                  >
                    no
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
