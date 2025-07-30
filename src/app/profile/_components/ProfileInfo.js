import Image from "next/image";

export default function ProfileInfo({ user }) {
  return (
    <div id="profile-info-section" className="flex">
      <Image alt="profile" src="/globe.svg" width={150} height={150} />
      <div className="flex flex-col gap-[1.25em] w-[75%] ml-auto">
        <hgroup className="flex flex-col gap-[0.5em]">
          <h1 className="text-4xl font-bold">{user.username}</h1>
          <p>{user.bio}</p>
        </hgroup>
        <menu className="flex gap-4">
          <li>
            <button className="px-[1.14em] py-[0.57em] bg-gray-800 hover:bg-gray-400 cursor-pointer transition-colors capitalize text-sm">
              edit
            </button>
          </li>
          <li>
            <button className="px-[1.14em] py-[0.57em] bg-gray-800 hover:bg-gray-400 cursor-pointer transition-colors capitalize text-sm">
              Delete
            </button>
          </li>
        </menu>
      </div>
    </div>
  );
}
