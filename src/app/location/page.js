import CommentCard from "./_components/CommentCard";
import CommentSection from "./_components/CommentSection";
import LocationInfo from "./_components/LocationInfo";

export default function Page() {
  const location = {
    name: "Prince St Pizza",
    city: "costa mesa",
    category: "food",
    authorUsername: "john_doe",
    address: "1870 Harbor Blvd #104, Costa Mesa, CA 92627",
    url: "www.princestreetpizza.com",
    description:
      "This place has the best pizza in costa mesa. I love the hot honey, the spicy girl and the spicy vodka. I would recommend this place to everyone. Come check it out when you have the chance. The service is also super good.",
  };

  const comments = {
    header: "comments",
    posts: [
      {
        username: "john_doe",
        comment:
          "This place is somewhat cool. Its alright. I've been here a couple of times and I have to say its not bad but not anything crazy. Would definitly go back tho lol. This is some extra text to test how it handles wrapping. Hopefully it works and I dont have to change anything lol",
        upvotes: 10,
        downvotes: 2,
      },
      {
        username: "sarah_smith",
        comment:
          "Loved the atmosphere! The staff were super friendly and the food was great. Highly recommend for a chill evening.",
        upvotes: 23,
        downvotes: 1,
      },
      {
        username: "mike_92",
        comment:
          "Not my favorite spot. It was a bit crowded and noisy when I visited. Might give it another try on a quieter day.",
        upvotes: 5,
        downvotes: 7,
      },
      {
        username: "travel_guru",
        comment:
          "A hidden gem! Perfect for a quick stop during my road trip. Clean and cozy.",
        upvotes: 15,
        downvotes: 0,
      },
      {
        username: "emma_w",
        comment:
          "Decent experience overall. The location is convenient but parking can be tricky.",
        upvotes: 8,
        downvotes: 3,
      },
    ],
    renderFunction: (post) => <CommentCard comment={post} />,
  };

  return (
    <div
      id="location-page"
      className="mx-[138px] min-h-screen flex flex-col py-[5%] gap-10"
    >
      <LocationInfo location={location} />
      <CommentSection
        header={comments.header}
        posts={comments.posts}
        renderFunction={comments.renderFunction}
      />
    </div>
  );
}
