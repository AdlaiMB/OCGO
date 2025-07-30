import List from "@/app/_components/List";

export default function ProfilePosts({ postLists }) {
  return (
    <div id="profile-posts-section" className="flex gap-[4%]">
      {postLists.map((postList, index) => (
        <div key={index} className="grow">
          <h2 className="font-medium text-2xl mb-2 capitalize">
            {postList.header}
          </h2>
          <List
            items={postList.posts}
            renderItem={postList.renderFunction}
          ></List>
        </div>
      ))}
    </div>
  );
}
