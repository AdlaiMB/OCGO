"use client";

import { serverActionSignUp } from "@/lib/actions";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function Page() {
  const [state, action, isPending] = useActionState(serverActionSignUp, null);
  const router = useRouter();

  useEffect(() => {
    if (!state || !state.success) {
      return;
    }
    setTimeout(() => {
      router.push(`/profile/${state.name}`);
    }, 1500);
  }, [state]);

  return (
    <div id="SignUpPage" className="max-w-[1700px] px-2 md:px-10 mt-14 mx-auto">
      {state && (
        <div
          className={`p-2 mb-4 text-sm md:text-base rounded-md border ${
            state.success
              ? "bg-green-800 border-green-600"
              : "bg-red-800 border-red-600"
          }`}
        >
          <p>
            {state.success
              ? "Sign up successful. You will be redirected to your profile page."
              : `Sign up unsuccessful. ${state.error}`}
          </p>
        </div>
      )}
      <div id="SignUpForm" className="posts-container p-3 md:p-4 lg:p-6">
        <h1 className="text-2xl md:text-3xl font-semibold">sign up</h1>
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
            required
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="password"
            className="text-sm md:text-base font-normal capitalize"
          >
            password
            <span className="lowercase ml-1 text-xs md:text-sm text-[#c4c3c3]">
              (must be between 10-16 character and contain a lowercase
              character, uppercase character, number, and a special character)
            </span>
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="enter password ..."
            required
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
            placeholder="enter bio ..."
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <button className="btn text-sm md:text-base py-4 px-7 rounded-md self-baseline transition-colors">
            {isPending ? "signing up ..." : "sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
