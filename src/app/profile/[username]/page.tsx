import { Card } from "@/components/ui/card";
import { getUserByUsername } from "@/app/firebase/users";
import { getModulesByUsername } from "@/app/firebase/modules";
import { notFound } from "next/navigation";
import ModulesFilter from "@/components/ui/modules-filter";
import { serializeFirestoreData } from "@/lib/serialize";
import { getFavouritesByUser } from "@/app/firebase/favorites";

interface UserPageProps {
  params: Promise<{ username: string }>;
}
export default async function UserProfile({ params }: UserPageProps) {
  const { username } = await params;

  console.log("🔍 Searching for user with username:", username);

  // 1. Сначала получаем пользователя
  const user = await getUserByUsername(username);

  if (!user) {
    console.log("❌ User not found");
    notFound();
  }

  console.log("✅ User found:", user);

  // 2. Параллельно загружаем созданные модули и избранные
  const [createdModules, savedModules] = await Promise.all([
    getModulesByUsername(username),
    getFavouritesByUser(user.uid), // Теперь user.uid доступен
  ]);

  console.log("📊 Results:", {
    created: createdModules.length,
    saved: savedModules.length,
  });
  return (
    <div className="flex justify-center items-start mt-8 min-h-screen">
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
                {user.createdAt?.toDate
                  ? user.createdAt.toDate().toLocaleDateString()
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
