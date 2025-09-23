"use server";

import argon2 from "argon2";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import sql from "@/db";
import { verifySession, getCommentOwnerId, getLocationOwnerId } from "./dal";
import {
  signUpUserFormSchema,
  updateUserFormSchema,
  updateLocationFormSchema,
  IDSchema,
  hourSchema,
  commentSchema,
  voteSchema,
  createErrorMessage,
} from "./definitions";

export const serverActionSignIn = async (prevState, formData) => {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    return { success: true, name: formData.get("username") };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid credentials." };
    }
    return {
      success: false,
      error: "An issue has occured during sing in, try again.",
    };
  }
};

export const serverActionSignUp = async (prevState, formData) => {
  // 2-tier security
  // 1st check: validate form data
  const validatedForm = signUpUserFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    bio: formData.get("bio"),
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionSignUp - ",
      validatedForm.error
    );
    const errorMessage = createErrorMessage(validatedForm.error.issues);
    return {
      success: false,
      error: errorMessage,
    };
  }

  const { username, password, bio } = validatedForm.data;

  // 2nd check: check for existing user
  try {
    const [existingUser] = await sql`SELECT name
                                   FROM Users
                                   WHERE name=${username}`;

    if (existingUser) {
      return {
        success: false,
        error: "A user with the provided username already exists.",
      };
    }
  } catch (error) {
    console.log(
      "DB Error: @serverActionSignUp - Failed to check for existing user."
    );
    console.log(error);
    return {
      success: false,
      error: "An issue has occured during sign up, try again.",
    };
  }

  // hash password
  let hash;

  try {
    hash = await argon2.hash(password);
  } catch (error) {
    console.log(error);
    console.log(
      "Hash Error: @serverActionSignUp - Failed to hash the password."
    );
    return {
      success: false,
      error: "An issue occured during sign up, try again.",
    };
  }

  // db operation
  try {
    const [newUser] =
      await sql`INSERT INTO Users (name, password, bio) VALUES (${username}, ${hash}, ${bio}) RETURNING name`;
    // create session
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    return { success: true, name: newUser.name };
  } catch (error) {
    console.log("DB Error: @serverActionSignUp - Failed to create user.");
    console.log(error);
    return {
      success: false,
      error: "An issue has occured during sign up, try again.",
    };
  }
};

export const serverActionCreateComment = async (prevState, formData) => {
  // 3-tier security
  // 1st check: verify session
  const session = await verifySession();

  // 2nd check: check for valid location id
  const validatedID = IDSchema.safeParse({ id: formData.get("location_id") });

  if (!validatedID.success) {
    console.log(
      "Validation Error: @serverActionCreateComment - ",
      validatedID.error
    );
    return { success: false, error: "Invalid location id." };
  }

  const { id: location_id } = validatedID.data;

  // 3rd check: check for valid form data
  const validatedForm = commentSchema.safeParse({
    comment: formData.get("comment"),
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionCreateComment - ",
      validatedForm.error
    );
    const errorMessage = createErrorMessage(validatedForm.error.issues);
    return {
      success: false,
      error: errorMessage,
    };
  }

  const { comment } = validatedForm.data;

  // db operation
  try {
    const [newComment] =
      await sql`INSERT INTO Comments (user_id, location_id, comment)
                VALUES (${session.id}, ${location_id}, ${comment})
                RETURNING comment_id, location_id`;
    return {
      success: true,
      location_id: newComment.location_id,
      comment_id: newComment.comment_id,
    };
  } catch (error) {
    console.log(
      "DB Error: @serverActionCreateComment - Failed to create comment."
    );
    console.log(error);
    return {
      success: false,
      error: "An issue has occured during posting the comment, try again.",
    };
  }
};

export const serverActionCreateLocation = async (prevState, formData) => {
  // 2-tier security
  // 1st check: verify session
  const session = await verifySession();

  // 2nd check: check for valid form data
  // 1st form validation: location data
  const validatedForm = updateLocationFormSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    category: formData.get("category"),
    address: formData.get("address"),
    url: formData.get("url"),
    description: formData.get("description"),
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionCreateLocation - ",
      validatedForm.error
    );
    const errorMessage = createErrorMessage(validatedForm.error.issues);
    return {
      success: false,
      error: errorMessage,
    };
  }

  const { name, city, category, address, url, description } =
    validatedForm.data;

  // 2nd form validation: hours data
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const createDays = [];

  // filter for days with values
  for (const day of days) {
    const [open, close] = formData.getAll(day);

    if (open || close) {
      createDays.push({ day, open, close });
    }
  }

  const validatedFormDays = [];

  // validate data
  for (const { day, open, close } of createDays) {
    const validatedData = hourSchema.safeParse({ day, open, close });

    if (!validatedData.success) {
      console.log(
        "Validation Error: @serverActionCreateLocation - ",
        validatedData.error
      );
      const errorMessage = createErrorMessage(validatedData.error.issues);
      return {
        success: false,
        error: errorMessage,
      };
    }

    validatedFormDays.push(validatedData.data);
  }

  // db operation
  try {
    const [newLocation] =
      await sql`INSERT INTO Locations (user_id, name, city, category, address, url, description)
                VALUES (${session.id}, ${name}, ${city}, ${category}, ${address}, ${url}, ${description})
                RETURNING location_id`;

    await sql.transaction((txn) => {
      const queries = [];

      for (const { day, open, close } of validatedFormDays) {
        queries.push(
          txn`INSERT INTO Hours (location_id, day, open, close)
              VALUES (${newLocation.location_id}, ${day}, ${open}, ${close})`
        );
      }

      return queries;
    });

    return { success: true, location_id: newLocation.location_id };
  } catch (error) {
    console.log(
      "DB Error: @serverActionCreateLocation - Failed to create location."
    );
    console.log(error);
    return {
      success: false,
      error: "An issued occured creating the location, try again.",
    };
  }
};

export const serverActionCreateVote = async (commentId, newVote) => {
  // 3-tier security
  // 1st check: verify session
  const session = await verifySession();

  // 2nd check: check for valid form id
  const validatedID = IDSchema.safeParse({ id: commentId });

  if (!validatedID.success) {
    console.log(
      "Validation Error: @serverActionCreateVote - ",
      validatedID.error
    );

    return { success: false, error: "Invalid comment id." };
  }

  const { id: comment_id } = validatedID.data;

  // 3rd check: check for valid form data
  const validatedForm = voteSchema.safeParse({
    vote: newVote,
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionCreateVote - ",
      validatedForm.error
    );
    return { success: false, error: "Invalid vote type." };
  }

  const { vote } = validatedForm.data;

  // db operation
  try {
    const [newVote] = await sql`INSERT INTO Votes (user_id, comment_id, vote)
                                VALUES (${session.id}, ${comment_id}, ${vote}) 
                                RETURNING comment_id, vote`;
    return {
      success: true,
      comment_id: newVote.comment_id,
      vote: newVote.vote,
    };
  } catch (error) {
    console.log("DB Error: @serverActionCreateVote - Failed to create vote.");
    console.log(error);
    return {
      success: true,
      error: "An issue occured creating vote, try again.",
    };
  }
};

export const serverActionUpdateUser = async (prevState, formData) => {
  // 2-tier security
  // 1st check: verify session
  const session = await verifySession();

  // 2nd check: validate form data
  // check for an optional password field
  const pwsd = formData.get("password");

  const validatedForm = updateUserFormSchema.safeParse({
    username: formData.get("username"),
    password: pwsd?.length > 0 ? pwsd : undefined,
    bio: formData.get("bio"),
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionUpdateUser - ",
      validatedForm.error
    );

    const errorMessage = createErrorMessage(validatedForm.error.issues);
    return { success: false, error: errorMessage };
  }

  const { username, password, bio } = validatedForm.data;

  // hash password if exists
  let hash;
  if (password) {
    try {
      hash = await argon2.hash(password);
    } catch (error) {
      console.log(error);
      console.log(
        `Hash Error: @serverActionUpdateUser - Failed to update user with user_id (${session.id}).`
      );
      return {
        success: false,
        error: "An issue occured updating user, try agin.",
      };
    }
  }

  // db operation
  // create set clause dynamically based on the presence of password
  const passwordClause = password ? sql`, password=${hash}` : sql``;
  const setClause = sql`SET name=${username}, bio=${bio} ${passwordClause}`;
  try {
    const [user] = await sql`UPDATE Users
                             ${setClause}
                             WHERE user_id=${session.id}
                             RETURNING name`;
    if (!user) {
      throw new Error("No user exists with the provided user_id.");
    }
    return { success: true, name: user.name };
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateUser - Failed to update user with user_id (${session.id}).`
    );
    console.log(error);
    return {
      success: false,
      error: "An issues occured updating user, try again.",
    };
  }
};

export const serverActionUpdateComment = async (prevState, formData) => {
  // 4-tier security
  // 1st check: verify session
  const session = await verifySession();

  // 2nd check: chek for valid comment id
  const validatedID = IDSchema.safeParse({ id: formData.get("id") });

  if (!validatedID.success) {
    console.log(
      "Validation Error: @serverActionUpdateComment - ",
      validatedID.error
    );
    return { success: false, error: "Invalid comment id." };
  }

  // 3rd check: check for user ownership of the comment
  const { id: comment_id } = validatedID.data;

  const { user_id } = await getCommentOwnerId(comment_id);

  if (session.id !== user_id) {
    console.log(
      `Security Error: @serverActionUpdateComment - user with user_id (${session.id}) does not own comment with comment_id (${comment_id}) to update comment.`
    );
    return {
      success: false,
      error: "Invalid authorization. You are not the owner of this comment.",
    };
  }

  // 4th check: check for valid form data
  const validatedForm = commentSchema.safeParse({
    comment: formData.get("comment"),
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionUpdateComment - ",
      validatedForm.error
    );
    return { success: false, error: "Invalid comment." };
  }

  const { comment } = validatedForm.data;

  // db operation
  try {
    const [updatedComment] = await sql`UPDATE Comments
                                       SET comment=${comment}
                                       WHERE comment_id=${comment_id}
                                       RETURNING location_id, comment_id`;
    if (!updatedComment) {
      throw new Error("No comment exists with the provided comment_id.");
    }
    return {
      success: true,
      location_id: updatedComment.location_id,
      comment_id: updatedComment.comment_id,
    };
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateComment - Failed to update comment with comment_id (${comment_id}).`
    );
    console.log(error);
    return {
      success: false,
      error: "An issue occured updating the comment, try again.",
    };
  }
};

export const serverActionUpdateLocation = async (prevState, formData) => {
  // 4-tier security
  // 1st check: verify session
  const session = await verifySession();

  // 3rd check: check for valid location id
  const validatedID = IDSchema.safeParse({ id: formData.get("id") });

  if (!validatedID.success) {
    console.log(
      "Validation Error: @serverActionUpdateLocation - ",
      validatedID.error
    );
    return { success: false, error: "Invalid location id." };
  }

  const { id: location_id } = validatedID.data;

  // 3rd step: check for user ownership of location
  const { user_id } = await getLocationOwnerId(location_id);

  if (session.id !== user_id) {
    console.log(
      `Security Error: @serverActionUpdateLocation - user with user_id (${session.id}) does not own location with location_id (${location_id}) to update location.`
    );
    return {
      success: false,
      error: "Invalid authorization. You are not the onwer of this location.",
    };
  }

  // 4th check: check for valid form data
  // 1st form validation: location data
  const validatedFormLocationData = updateLocationFormSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    category: formData.get("category"),
    address: formData.get("address"),
    url: formData.get("url"),
    description: formData.get("description"),
  });

  if (!validatedFormLocationData.success) {
    console.log(
      "Validation Error: @serverActionUpdateLocation - ",
      validatedFormLocationData.error
    );

    const errorMessage = createErrorMessage(
      validatedFormLocationData.error.issues
    );
    return { success: false, error: errorMessage };
  }

  const { name, city, category, address, url, description } =
    validatedFormLocationData.data;

  // 2nd form validation: hours data (two step process: filter new days and existing days, then validate data)
  // 1st step: filter new days and existing days
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const createDays = [];
  const updateDays = [];

  for (const day of days) {
    const [updateOpen, updateClose] = formData.getAll(day);
    const [createOpen, createClose] = formData.getAll(`new-${day}`);

    if (updateOpen || updateClose) {
      updateDays.push({ day, open: updateOpen, close: updateClose });
    }

    if (createOpen || createClose) {
      createDays.push({ day, open: createOpen, close: createClose });
    }
  }

  // 2nd step: validate data
  const validatedFormHoursCreateDays = [];
  const validatedFormHoursUpdateDays = [];

  for (const { day, open, close } of createDays) {
    const validatedData = hourSchema.safeParse({ day, open, close });
    if (!validatedData.success) {
      console.log(
        "Validation Error: @serverActionUpdateLocation - ",
        validatedData.error
      );
      const errorMessage = createErrorMessage(validatedData.error.issues);
      return { success: false, error: errorMessage };
    }

    validatedFormHoursCreateDays.push(validatedData.data);
  }

  for (const { day, open, close } of updateDays) {
    const validatedData = hourSchema.safeParse({ day, open, close });
    if (!validatedData.success) {
      console.log(
        "Validation Error: @serverActionUpdateLocation -",
        validatedData.error
      );
      const errorMessage = createErrorMessage(validatedData.error.issues);
      return { success: false, error: errorMessage };
    }

    validatedFormHoursUpdateDays.push(validatedData.data);
  }

  // db operation
  try {
    const [updatedLocation] = await sql.transaction((txn) => {
      const queries = [];

      queries.push(
        txn`UPDATE Locations
            SET name=${name}, city=${city}, category=${category}, address=${address}, url=${url}, description=${description}
            WHERE location_id=${location_id}
            RETURNING location_id`
      );

      for (const { day, open, close } of validatedFormHoursUpdateDays) {
        queries.push(
          txn`UPDATE Hours
              SET open=${open}, close=${close}
              WHERE location_id=${location_id} AND day=${day}`
        );
      }

      for (const { day, open, close } of validatedFormHoursCreateDays) {
        queries.push(
          txn`INSERT INTO Hours (location_id, day, open, close)
              VALUES (${location_id}, ${day}, ${open}, ${close})`
        );
      }

      return queries;
    });

    if (!updatedLocation[0]) {
      throw new Error("No location exists with the provided location_id.");
    }

    return { success: true, location_id: updatedLocation[0].location_id };
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateLocation - Failed to update location with location_id (${location_id}).`
    );
    console.log(error);
    return {
      success: false,
      error: "An issue occured updating location, try again.",
    };
  }
};

export const serverActionUpdateVote = async (commnetId, updateVote) => {
  // 1s check: verify session
  const session = await verifySession();

  // 2nd check: check for valid comment id
  const validatedID = IDSchema.safeParse({ id: commnetId });

  if (!validatedID.success) {
    console.log(
      "Validation Error: @serverActionUpdateVote - ",
      validatedID.error
    );
    return { success: false, error: "Invalid comment id." };
  }

  const { id: comment_id } = validatedID.data;

  // 3rd check: check for valid form data
  const validatedForm = voteSchema.safeParse({
    vote: updateVote,
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionUpdateVote - ",
      validatedForm.error
    );
    return { success: false, error: "Invalid vote type." };
  }

  const { vote } = validatedForm.data;

  // db operation
  try {
    const [updatedVote] = await sql`UPDATE Votes
                                    SET vote=${vote}
                                    WHERE user_id=${session.id} AND comment_id=${comment_id}
                                    RETURNING comment_id, vote`;

    if (!updatedVote) {
      throw new Error(
        "No vote exists with the provided user_id and comment_id"
      );
    }
    return {
      success: true,
      comment_id: updatedVote.comment_id,
      vote: updatedVote.vote,
    };
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateVote - Failed to update vote with comment_id (${comment_id}).`
    );
    console.log(error);
    return {
      success: false,
      error: "An issue occured updating vote, try again.",
    };
  }
};

export const serverActionDeleteUser = async () => {
  // 1-tier security
  // 1st check: verfiy session
  const session = await verifySession();

  // db operation
  try {
    const [user] =
      await sql`DELETE FROM Users WHERE user_id=${session.id} RETURNING user_id`;
    return { success: true, user_id: user.user_id };
    // signout to destroy the session
  } catch (error) {
    console.log(
      `DB Error: @serverActionDeleteUser - Failed to delete the signined in user with user_id (${session.id}).`
    );
    console.log(error);
    return {
      success: false,
      error: "An issue occured deleting the user, try again.",
    };
  }
};

export const serverActionDeleteComment = async (commentId) => {
  // 3-tier security
  // 1st check: verify session
  const session = await verifySession();

  // 2nd check: check for valid comment id
  const validatedID = IDSchema.safeParse({ id: commentId });

  if (!validatedID.success) {
    console.log(
      "Validation Error: @serverActionDeleteComment - ",
      validatedID.error
    );
    return { success: false, error: "Invalid comment id." };
  }

  const { id: comment_id } = validatedID.data;

  // 3rd check: check for user ownership of the comment
  const { user_id } = await getCommentOwnerId(comment_id);

  if (session.id !== user_id) {
    console.log(
      `Security Error: @serverActionDeleteComment - user with user_id (${session.id}) does not own comment with comment_id (${comment_id}) to delete.`
    );
    return {
      success: false,
      error: "Invalid authorization. You do not own this comment.",
    };
  }

  // db operation
  try {
    const [comment] =
      await sql`DELETE FROM Comments WHERE comment_id=${comment_id} returning comment_id`;
    if (!comment) {
      throw new Error("No comment exists with the provided comment_id");
    }
    return { success: true, comment_id: comment.comment_id };
  } catch (error) {
    console.log(
      `DB Error: @serverActionDeleteComment - Failed to delete the comment with comment_id (${comment_id}).`
    );
    console.log(error);
    return {
      success: false,
      error: "An issue occured deleting the comment, try again.",
    };
  }
};

export const serverActionDeleteVote = async (commentId) => {
  // 1st check: verify session
  const session = await verifySession();

  // 2nd check: check for valid comment id
  const validatedID = IDSchema.safeParse({ id: commentId });

  if (!validatedID.success) {
    console.log(
      "Validation Error: @serverActionDeleteVote - ",
      validatedID.error
    );
    return { success: false, error: "Invalid comment id." };
  }

  const { id: comment_id } = validatedID.data;

  // db operation
  try {
    const [deletedVote] =
      await sql`DELETE FROM Votes WHERE user_id=${session.id} AND comment_id=${comment_id} RETURNING comment_id`;
    if (!deletedVote) {
      throw new Error(
        "No vote exists with the provided user_id and comment_id"
      );
    }
    return { success: true, comment_id: deletedVote.comment_id };
  } catch (error) {
    console.log(
      `DB Error: @serverActionDeleteVote - Failed to delete the vote with comment_id (${comment_id}).`
    );
    console.log(error);
    return {
      success: false,
      error: "An issue occured deleting the vote, try again.",
    };
  }
};
