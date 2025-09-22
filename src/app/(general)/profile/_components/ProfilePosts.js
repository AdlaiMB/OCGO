"use client";

import { useState } from "react";

import LocationPosts from "./LocationPosts";
import CommentPosts from "./CommentPosts";

export default function ProfilePosts({
  locations,
  comments,
  isSessionUsersProfile,
}) {
  const [display, setDisplay] = useState("locations");

  const handleDisplay = (displayChange) => {
    setDisplay(displayChange);
  };

  const hidden = display === "locations" ? "comments" : "locations";

  const styles = {
    locations: hidden === "locations" ? "hidden" : "block",
    comments: hidden === "comments" ? "hidden" : "block",
  };

  return (
    <div id="ProfilePosts">
      <div className="lg:hidden">
        <span className="text-md font-medium"> display: </span>
        <button
          onClick={() => handleDisplay(hidden)}
          className=" btn text-xs md:text-sm rounded-sm p-2 transition-colors mb-2"
        >
          {display === "locations" ? "comments" : "locations"}
        </button>
      </div>
      <div className="flex gap-20">
        <LocationPosts
          view={styles["locations"]}
          locations={locations}
          isSessionUsersProfile={isSessionUsersProfile}
        />
        <CommentPosts
          view={styles["comments"]}
          comments={comments}
          isSessionUsersProfile={isSessionUsersProfile}
        />
      </div>
    </div>
  );
}
