"use server";

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
} from "./definitions";

export const serverActionCreateUser = async (prevState, formData) => {
  // one-tier security
  // 1st check: validate form data
  const validatedForm = signUpUserFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    bio: formData.get("bio"),
  });

  if (!validatedForm.success) {
    console.log(
      "Validation Error: @serverActionCreateUser - ",
      validatedForm.error
    );
    return null;
  }

  const { username, password, bio } = validatedForm.data;

  // hash the password

  // db operation
  try {
    const [newUser] =
      await sql`INSERT INTO Users (name, password, bio) VALUES (${username}, ${password}, ${bio}) RETURNING user_id`;
    return newUser;
  } catch (error) {
    console.log("DB Error: @serverActionCreateUser - Failed to create user.");
    console.log(error);
    return null;
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
    return null;
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
    return null;
  }

  const { comment } = validatedForm.data;

  // db operation
  try {
    const [newComment] =
      await sql`INSERT INTO Comments (user_id, location_id, comment)
                VALUES (${session.id}, ${location_id}, ${comment})
                RETURNING comment_id, location_id`;
    return newComment;
  } catch (error) {
    console.log(
      "DB Error: @serverActionCreateComment - Failed to create comment."
    );
    console.log(error);
    return null;
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
    return null;
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
      return null;
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

    return newLocation;
  } catch (error) {
    console.log(
      "DB Error: @serverActionCreateLocation - Failed to create location."
    );
    console.log(error);
    return null;
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
    return null;
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
    return null;
  }

  const { vote } = validatedForm.data;

  // db operation
  try {
    const [newVote] = await sql`INSERT INTO Votes (user_id, comment_id, vote)
                                VALUES (${session.id}, ${comment_id}, ${vote}) 
                                RETURNING comment_id, vote`;
    return newVote;
  } catch (error) {
    console.log("DB Error: @serverActionCreateVote - Failed to create vote.");
    console.log(error);
    return null;
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
    return null;
  }

  const { username, password, bio } = validatedForm.data;

  // hash password if exists

  // db operation
  // create set clause dynamically based on the presence of password
  const passwordClause = password ? sql`, password=${password}` : sql``;
  const setClause = sql`SET name=${username}, bio=${bio} ${passwordClause}`;
  try {
    const [user] = await sql`UPDATE Users
                             ${setClause}
                             WHERE user_id=${session.id}
                             RETURNING name`;
    return user;
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateUser - Failed to update user with user_id (${session.id}).`
    );
    console.log(error);
    return null;
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
    return null;
  }

  // 3rd check: check for user ownership of the comment
  const { id: comment_id } = validatedID.data;

  const { user_id } = await getCommentOwnerId(comment_id);

  if (session.id !== user_id) {
    console.log(
      `Security Error: @serverActionUpdateComment - user with user_id (${session.id}) does not own comment with comment_id (${comment_id}) to update comment.`
    );
    return null;
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
    return null;
  }

  const { comment } = validatedForm.data;

  // db operation
  try {
    const [updatedComment] = await sql`UPDATE Comments
                                       SET comment=${comment}
                                       WHERE comment_id=${comment_id}
                                       RETURNING comment_id`;
    return updatedComment;
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateComment - Failed to update comment with comment_id (${comment_id}).`
    );
    console.log(error);
    return null;
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
    return null;
  }

  const { id: location_id } = validatedID.data;

  // 3rd step: check for user ownership of location
  const { user_id } = await getLocationOwnerId(location_id);

  if (session.id !== user_id) {
    console.log(
      `Security Error: @serverActionUpdateLocation - user with user_id (${session.id}) does not own location with location_id (${location_id}) to update location.`
    );
    return null;
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
    return null;
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
      return null;
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
      return null;
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

    return updatedLocation;
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateLocation - Failed to update location with location_id (${location_id}).`
    );
    console.log(error);
    return null;
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
    return null;
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
    return null;
  }

  const { vote } = validatedForm.data;

  // db operation
  try {
    const [updatedVote] = await sql`UPDATE Votes
                                    SET vote=${vote}
                                    WHERE user_id=${session.id} AND comment_id=${comment_id}
                                    RETURNING comment_id, vote`;
    return updatedVote;
  } catch (error) {
    console.log(
      `DB Error: @serverActionUpdateVote - Failed to update vote with comment_id (${comment_id}).`
    );
    console.log(error);
    return null;
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
    return user;
    // signout to destroy the session
  } catch (error) {
    console.log(
      `DB Error: @serverActionDeleteUser - Failed to delete the signined in user with user_id (${session.id}).`
    );
    console.log(error);
    return null;
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
    return null;
  }

  const { id: comment_id } = validatedID.data;

  // 3rd check: check for user ownership of the comment
  const { user_id } = await getCommentOwnerId(comment_id);

  if (session.id !== user_id) {
    console.log(
      `Security Error: @serverActionDeleteComment - user with user_id (${session.id}) does not own comment with comment_id (${comment_id}) to delete.`
    );
    return null;
  }

  // db operation
  try {
    const [comment] =
      await sql`DELETE FROM Comments WHERE coment_id=${comment_id} returning comment_id`;
    return comment;
  } catch (error) {
    console.log(
      `DB Error: @serverActionDeleteComment - Failed to delete the comment with comment_id (${comment_id}).`
    );
    console.log(error);
    return null;
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
    return null;
  }

  const { id: comment_id } = validatedID.data;

  // db operation
  try {
    const [vote] =
      await sql`DELETE FROM Votes WHERE user_id=${session.id} AND comment_id=${comment_id} RETURNING comment_id`;
    return vote;
  } catch (error) {
    console.log(
      `DB Error: @serverActionDeleteVote - Failed to delete the vote with comment_id (${comment_id}).`
    );
    console.log(error);
    return null;
  }
};
