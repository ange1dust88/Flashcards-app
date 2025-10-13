"use client";
import React, { use, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getUserByUsername, User } from "@/app/firebase/users";
import { Spinner } from "@/components/ui/spinner";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default function MyProfile({ params }: UserPageProps) {
  const { username } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserByUsername(username);
      setUser(data);
      setLoading(false);
    }
    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        User not found 😢
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start mt-8 h-screen">
      <div className="container text-white grid grid-cols-[30fr_70fr] gap-2">
        {/* left */}
        <div>
          <Card className="flex flex-col justify-center items-center gap-1 h-64 border border-neutral-800">
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

        {/* right */}
        <div>
          <img
            src={user.bannerURL || "/exampleImage.jpg"}
            alt="banner"
            className="h-64 rounded-xl w-full object-cover border border-neutral-800"
          />
        </div>
      </div>
    </div>
  );
}
