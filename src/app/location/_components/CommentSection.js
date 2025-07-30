import List from "@/app/_components/List";

export default function CommentSection({ header, posts, renderFunction }) {
  return (
    <div id="comment-section" className="">
      <h2 className="font-medium text-2xl mb-2 capitalize">{header}</h2>
      <List items={posts} renderItem={renderFunction} />
    </div>
  );
}
