import ProfileInfo from "./_components/ProfileInfo";
import ProfilePosts from "./_components/ProfilePosts";
import CommentCard from "./_components/CommentCard";
import LocationCard from "./_components/LocationCard";

export default function Page() {
  const user = {
    username: "john_doe",
    bio: "Web developer and tech enthusiast.",
  };

  const postLists = [
    {
      header: "locations",
      posts: [
        {
          name: "old town west",
          city: "San Francisco",
          category: "Historical",
          description: "A beautiful place with rich history and culture.",
        },
        {
          name: "downtown",
          city: "Los Angeles",
          category: "Urban",
          description: "The heart of the city with vibrant nightlife.",
        },
        {
          name: "uptown",
          city: "New York",
          category: "Residential",
          description: "A quiet neighborhood with a community feel.",
        },
      ],
      renderFunction: (post) => <LocationCard location={post} />,
    },
    {
      header: "comments",
      posts: [
        {
          locationName: "old town west",
          comment:
            "This place was cool. They have these things to offer and I enjoyed all of those things. The service was amazing. I would definitly be comming again.",
          upvotes: 10,
          downvotes: 2,
        },
        {
          locationName: "downtown",
          comment:
            "I had a great time here. The atmosphere was lively and the food was delicious.",
          upvotes: 5,
          downvotes: 1,
        },
        {
          locationName: "uptown",
          comment:
            "Not my favorite place, but it has its charm. Could use some improvements.",
          upvotes: 2,
          downvotes: 3,
        },
      ],
      renderFunction: (post) => <CommentCard comment={post} />,
    },
  ];

  return (
    <div
      id="profile-page"
      className="mx-[138px] h-screen flex flex-col py-[5%] gap-[15%]"
    >
      <ProfileInfo user={user} />
      <ProfilePosts postLists={postLists} />
    </div>
  );
}
