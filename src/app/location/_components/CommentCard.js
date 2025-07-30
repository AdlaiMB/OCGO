import Image from "next/image";

export default function CommentCard({ comment }) {
  return (
    <div className="flex flex-col bg-white text-black w-full gap-1 py-[0.25em] px-[0.5em]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image alt="profile" src="/globe.svg" width={40} height={40} />
          <h4 className="text-lg">@{comment.username}</h4>
        </div>
        <menu className="flex gap-4">
          <menu className="flex gap-4">
            <li>
              <button>edit</button>
            </li>
            <li>
              <button>delete</button>
            </li>
          </menu>
        </menu>
      </div>
      <p className="text-pretty">{comment.comment}</p>
      <div className="flex gap-2">
        <span>Upvotes: {comment.upvotes}</span>
        <span>Downvotes: {comment.downvotes}</span>
      </div>
    </div>
  );
}
