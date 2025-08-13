import { getCommentById } from "@/db/comment/actions";
import CommentForm from "../_components/CommentForm.js";

export default async function Page({ params }) {
  const { commentId } = await params;
  const comment = await getCommentById(commentId);

  return <CommentForm comment={comment} />;
}
