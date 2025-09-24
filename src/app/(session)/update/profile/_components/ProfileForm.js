"use client";

import { serverActionUpdateUser } from "@/lib/actions";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfileForm({ name, bio }) {
  const [state, action, isPending] = useActionState(
    serverActionUpdateUser,
    null
  );
  const { update } = useSession();
  const router = useRouter();

  async function updateSession() {
    await update({ name: state.name });
    setTimeout(() => {
      router.push(`/profile/${state.name}`);
    }, 1500);
  }

  useEffect(() => {
    if (!state || !state.success) {
      return;
    }
    updateSession();
  }, [state]);

  return (
    <div id="UserFormPage" className="max-w-[1700px] px-10 mt-14 mx-auto">
      {state && (
        <div
          className={`p-2 mb-4 rounded-md border ${
            state.success
              ? "bg-green-800 border-green-600"
              : "bg-red-800 border-red-600"
          }`}
        >
          <p>
            {state.success
              ? "Update successful. You will be redirected to your profile page."
              : `Update unsuccessful. ${state.error}`}
          </p>
        </div>
      )}
      <div id="UserForm" className="posts-container p-3 md:p-4 lg:p-6">
        <h1 className="text-2xl md:text-3xl font-semibold">update profile</h1>
        <form action={action} className="flex flex-col gap-4">
          <label
            htmlFor="username"
            className="text-sm md:text-base font-normal capitalize"
          >
            username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="enter username ..."
            defaultValue={name}
            required
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="password"
            className="text-sm md:text-base font-normal capitalize"
          >
            password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="enter password ..."
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="bio"
            className="text-sm md:text-base font-normal capitalize"
          >
            bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="7"
            defaultValue={bio}
            placeholder="enter bio ..."
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />

          <button
            disabled={isPending}
            className="btn text-sm md:text-base py-4 px-7 rounded-md self-baseline transition-colors"
          >
            {isPending ? "updating ..." : "update"}
          </button>
        </form>
      </div>
    </div>
  );
}
