import { getUser } from "@/db/user/actions.js";
import ProfileForm from "../_components/ProfileForm";

export default async function Page({ params }) {
  const { profileId } = await params;
  const user = await getUser(profileId);

  return <ProfileForm user={user} />;
}
