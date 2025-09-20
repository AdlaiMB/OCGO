import { auth } from "@/auth";
import { redirect } from "next/navigation.js";

import { getCommentByCommentId, getCommentOwnerId } from "@/lib/dal";

import CommentForm from "../_components/CommentForm.js";

export default async function Page({ params }) {
  const { commentId } = await params;

  // 1-tier security
  // 1st check: check if user owns the comment
  const session = await auth();
  const { user_id } = await getCommentOwnerId(commentId);

  if (session.user.id !== user_id) {
    redirect(`/profile/${session.user.name}`); // TODO : Fix the redirect link for all redirects
  }

  const { comment } = await getCommentByCommentId(commentId);

  return <CommentForm commentId={commentId} comment={comment} />;
}
