import PostWave from "@/components/forms/PostWave";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/Onboarding");
  return (
    <>
      <h1 className="head-text">Wave</h1>
      <PostWave userId={userInfo._id} />
    </>
  );
}

export default Page;
