"use server";

import sql from "../db.js";
import { redirect } from "next/navigation";

// create operations

// read operations
export async function getCommentById(commentId) {
  const [comment] =
    await sql`SELECT public.comment.id, name AS locationname, comment
              FROM public.comment INNER JOIN public.location ON public.comment.location_id = public.location.id
              WHERE public.comment.id = ${commentId}`;

  return comment;
}

export async function getCommentsByUser(username) {
  const rows =
    await sql`SELECT public.comment.id, public.comment.location_id, name AS locationname, comment, upvotes, downvotes 
              FROM public.comment INNER JOIN public.location ON public.comment.location_id = public.location.id 
              WHERE public.comment.username = ${username}`;
  return rows;
}

export async function getCommentsByLocation(loationId) {
  const rows =
    await sql`SELECT id, username, comment, upvotes, downvotes FROM public.comment WHERE location_id = ${loationId}`;

  return rows;
}

// update operations
export async function updateComment(prevState, formData) {
  const commentId = formData.get("commentId");
  const updatedComment = formData.get("comment");

  await sql`UPDATE public.comment
            SET comment = ${updatedComment}
            WHERE id = ${commentId}`;

  redirect("/profile/admin");
}

// delete operations
export async function deleteComment(commentId) {
  const [comment] =
    await sql`DELETE FROM public.comment WHERE id = ${commentId} RETURNING id`;

  return comment.id;
}
