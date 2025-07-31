import SearchBar from "./_components/SearchBar";
import LocationSection from "./_components/LocationSection";
import LocationCard from "./_components/LocationCard";

export default function Page() {
  const locations = {
    posts: [
      {
        name: "Prince St Pizza",
        city: "costa mesa",
        category: "food",
        authorUsername: "john_doe",
        address: "1870 Harbor Blvd #104, Costa Mesa, CA 92627",
      },
      {
        name: "Sidecar Doughnuts",
        city: "costa mesa",
        category: "food",
        authorUsername: "sarah_smith",
        address: "270 E 17th St #18, Costa Mesa, CA 92627",
      },
      {
        name: "The LAB Anti-Mall",
        city: "costa mesa",
        category: "shop",
        authorUsername: "emma_w",
        address: "2930 Bristol St, Costa Mesa, CA 92626",
      },
      {
        name: "Segerstrom Center for the Arts",
        city: "costa mesa",
        category: "entertainment",
        authorUsername: "mike_92",
        address: "600 Town Center Dr, Costa Mesa, CA 92626",
      },
      {
        name: "Coffee Dose",
        city: "costa mesa",
        category: "cafe",
        authorUsername: "travel_guru",
        address: "2701 S Harbor Blvd, Costa Mesa, CA 92626",
      },
    ],
    renderFunction: (item) => <LocationCard location={item} />,
  };

  return (
    <div
      id="search-page"
      className="mx-[138px] h-screen flex items-center flex-col py-[5%] gap-[5%]"
    >
      <SearchBar />
      <LocationSection locations={locations} />
    </div>
  );
}
