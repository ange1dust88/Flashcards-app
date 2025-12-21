import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";
import ModulesFilter from "@/components/ui/modules-filter";
import { serializeFirestoreData } from "@/lib/serialize";

interface UserPageProps {
  params: { username: string };
}

export default async function UserProfile({ params }: UserPageProps) {
  const { username } = params;

  const userRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`
  );
  const userData = await userRes.json();

  if (!userData.user) {
    notFound();
  }

  const user = userData.user;

  const createdModulesRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/modules/user/${username}`
  );
  const createdModulesData = await createdModulesRes.json();
  const createdModules = createdModulesData.modules || [];

  const savedModuleRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites/${user.uid}`
  );
  const savedModulesData = await savedModuleRes.json();
  const savedModules = savedModulesData.modules || [];

  return (
    <div className="flex justify-center items-start mt-8 h-[calc(100vh-6.1rem)]">
      <div className="container ">
        <div className="grid grid-cols-[2fr_4fr] gap-2">
          {/* LEFT */}
          <div>
            <Card className="flex flex-col justify-center items-center gap-1 h-64 border border-neutral-800 p-4">
              <img
                className="h-32 w-32 rounded-full mb-2 object-cover"
                src={user.photoURL || "/exampleImage.jpg"}
                alt="user avatar"
              />
              <p className="text-2xl font-semibold">{user.username}</p>
              <p className="text-neutral-400">
                Registration date:{" "}
                {user.createdAt
                  ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                  : "Unknown"}
              </p>
            </Card>
          </div>

          {/* RIGHT */}
          <div>
            <img
              src={user.bannerURL || "/exampleImage.jpg"}
              alt="banner"
              className="h-64 rounded-lg w-full object-cover border border-neutral-800 mb-4"
            />
          </div>
        </div>

        <ModulesFilter
          createdModules={serializeFirestoreData(createdModules)}
          savedModules={serializeFirestoreData(savedModules)}
        />
      </div>
    </div>
  );
}
