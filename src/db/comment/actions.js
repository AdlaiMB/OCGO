"use server";

import sql from "../db.js";

// create operations

// read operations
export async function getCommentsByUser(username) {
  const rows =
    await sql`SELECT public.comment.id, name AS locationname, comment, upvotes, downvotes 
              FROM public.comment INNER JOIN public.location ON public.comment.location_id = public.location.id 
              WHERE public.comment.username = ${username}`;
  return rows;
}

// update operations

// delete operations
export async function deleteComment(commentId) {
  const [comment] =
    await sql`DELETE FROM public.comment WHERE id = ${commentId} RETURNING id`;

  return comment.id;
}
