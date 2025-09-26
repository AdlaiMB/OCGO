import "server-only";

import { redirect } from "next/navigation";

import sql from "@/db/db";
import { auth } from "@/auth";

export const verifySession = async () => {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return session.user;
};

export const getUserByUserId = async (userId) => {
  try {
    const [user] = await sql`SELECT name, bio
                             FROM Users 
                             WHERE user_id=${userId}`;
    return user ? user : {};
  } catch (error) {
    console.log("Error: Failed to fetch user.");
    console.log(error);
    return null;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const [user] = await sql`SELECT user_id, name, bio
                             FROM Users 
                             WHERE name=${username}`;
    return user ? user : {};
  } catch (error) {
    console.log("Error: Failed to fetch user.");
    console.log(error);
    return null;
  }
};

export const getCommentByCommentId = async (commentId) => {
  try {
    const [comment] = await sql`SELECT comment
                                FROM Comments
                                WHERE comment_id=${commentId}`;

    return comment ? comment : {};
  } catch (error) {
    console.log("Error: Failed to fetch comment by id");
    console.log(error);
    return null;
  }
};

export const getLocationByLocationId = async (locationId) => {
  try {
    const [location] =
      await sql`SELECT user_id, user_name, location_name, city, category, address, url, description, hours
                FROM location_info
                WHERE location_id=${locationId}`;

    return location ? location : {};
  } catch (error) {
    console.log("Error: Failed to fetch location by location id.");
    console.log(error);
    return null;
  }
};

export const getAbstractLocationsByUserId = async (userId) => {
  try {
    const locations = sql`SELECT location_id, name, city, category, description
                          FROM Locations
                          WHERE user_id=${userId}
                          ORDER BY location_id ASC`;

    return locations;
  } catch (error) {
    console.log("Error: Failed to fetch abstract of locations by user id.");
    console.log(error);
    return null;
  }
};

export const getAbstractCommentsByUserId = async (userId) => {
  try {
    const comments = sql`SELECT comment_id, location_id, location_name, comment, upvotes, downvotes
                         FROM comment_info
                         WHERE user_id=${userId}
                         ORDER BY comment_id ASC`;

    return comments;
  } catch (error) {
    console.log("Error: Failed to fetch abstract of comments by user id.");
    console.log(error);
    return null;
  }
};

export const getCommentsByLocationId = async (locationId) => {
  try {
    const comments =
      await sql`SELECT user_id, comment_id, user_name, comment, upvotes, downvotes
                FROM comment_info
                WHERE location_id=${locationId}
                ORDER BY comment_id ASC`;
    return comments;
  } catch (error) {
    console.log("Error: Failed to fetch comments by location id.");
    console.log(error);
    return null;
  }
};

export const getSearchAbstractLocations = async () => {
  try {
    const locations =
      await sql`SELECT user_id, location_id, user_name, location_name, city, category, address
                FROM location_info`;
    return locations;
  } catch (error) {
    console.log("Error: Failed to fetch search abstract locations.");
    console.log(error);
    return null;
  }
};

export const getCommentOwnerId = async (commentId) => {
  try {
    const [comment] = await sql`SELECT user_id
                                FROM Comments
                                WHERE comment_id=${commentId}`;
    return comment ? comment : {};
  } catch (error) {
    console.log("Error: Failed to fetch comment owner id.");
    console.log(error);
    return null;
  }
};

export const getLocationOwnerId = async (locationId) => {
  try {
    const [comment] = await sql`SELECT user_id
                                FROM Locations
                                WHERE location_id=${locationId}`;
    return comment ? comment : {};
  } catch (error) {
    console.log("Error: Failed to fetch location owner id.");
    console.log(error);
    return null;
  }
};

export const getCommentVote = async (userId, commentId) => {
  try {
    const [vote] = await sql`SELECT vote
                             FROM Votes
                             WHERE user_id=${userId} AND comment_id=${commentId}`;
    return vote ? vote : {};
  } catch (error) {
    console.log("Failed to fetch comment vote.");
    console.log(error);
    return null;
  }
};

export const getUserForAuth = async (username) => {
  try {
    const [user] = await sql`SELECT user_id, name, password
                             FROM Users
                             WHERE name=${username}`;
    return user ? user : null;
  } catch (error) {
    console.log("Failed to fetch user by username and password.");
    console.log(error);
    return null;
  }
};
