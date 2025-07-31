import List from "@/app/_components/List";

export default function LocationSection({ locations }) {
  return <List items={locations.posts} renderItem={locations.renderFunction} />;
}
