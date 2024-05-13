import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((action: any) => {
              return (
                <Link key={action.id} href={`/thread/${action.parentId}`}>
                  <article className="activity-card">
                    <Image
                      className="rounded-full object-cover"
                      src={action.author.image}
                      alt="profile-picture"
                      width={20}
                      height={20}
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        { action.author.name }
                      </span>{" "}
                      replied to your thread.
                    </p>
                  </article>
                </Link>
              );
            })}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
}
