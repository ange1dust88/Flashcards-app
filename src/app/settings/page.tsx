"use client";
import { useUserStore } from "@/store/userStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function Settings() {
  const [user, loading] = useAuthState(auth);
  const { username, photoURL, bannerURL } = useUserStore();
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingBanner, setUploadingBanner] = useState<boolean>(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [uploadingBannerPhoto, setUploadingBannerPhoto] =
    useState<boolean>(false);
  const router = useRouter();

  const [newProfilePicture, setNewProfilePicture] = useState<string>("");
  const [newProfileBanner, setNewProfileBanner] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && (!user || !username)) {
      router.push("/");
    }
  }, [loading, user, username]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-neutral-950">
        <Spinner />
      </div>
    );
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    return data.url;
  };

  const updateProfilePicture = async () => {
    if (!newProfilePicture || !user) {
      toast("No photo uploaded");
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await fetch("/api/users/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, photoURL: newProfilePicture }),
      });

      if (!res.ok) throw new Error("Failed to update photo");

      useUserStore.getState().setPhotoURL(newProfilePicture);
      toast("Profile photo updated");
    } catch (err) {
      console.error(err);
      toast("Failed to update photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updateBannerPicture = async () => {
    if (!newProfileBanner || !user) {
      toast("No banner uploaded");
      return;
    }

    setUploadingBannerPhoto(true);
    try {
      const res = await fetch("/api/users/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, bannerURL: newProfileBanner }),
      });

      if (!res.ok) throw new Error("Failed to update banner");

      useUserStore.getState().setBannerURL(newProfileBanner);
      toast("Banner updated");
    } catch (err) {
      console.error(err);
      toast("Failed to update banner");
    } finally {
      setUploadingBannerPhoto(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-start bg-neutral-950">
      <div className="container mt-16 ">
        <h1 className="text-white text-2xl font-semibold">Profile settings</h1>
        <div className="grid grid-cols-[2fr_5fr] gap-8 h-full">
          {/* LEFT */}
          <div className="flex flex-col gap-1">
            <span className="text-sm mt-4 cursor-pointer font-semibold">
              Main
            </span>
            <span
              onClick={() => router.push(`/profile/${username}`)}
              className="text-sm text-neutral-400 flex items-center gap-2 transition-colors duration-200 cursor-pointer hover:text-white"
            >
              My profile
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                className="h-5 w-5"
              >
                <path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z" />
              </svg>
            </span>
          </div>
          {/* RIGHT */}

          <div className="flex flex-col gap-8">
            {/* change avatar */}
            <div className="border border-neutral-800 w-full rounded-lg bg-neutral-900">
              <div className="p-6">
                <h3 className="text-md font-semibold">Profile picture</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Inappropriate or offensive images will be removed and may
                  result in account suspension.
                </p>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"dark"}>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                        >
                          <path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM224 256C224 238.3 238.3 224 256 224L320 224C337.7 224 352 238.3 352 256L352 512L384 512C401.7 512 416 526.3 416 544C416 561.7 401.7 576 384 576L256 576C238.3 576 224 561.7 224 544C224 526.3 238.3 512 256 512L288 512L288 288L256 288C238.3 288 224 273.7 224 256z" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=" text-sm">
                      <DropdownMenuLabel>
                        Profile picture guidelines
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <ul className="space-y-1 text-neutral-300 p-2">
                        <li>• Avoid nudity, violence, or hate symbols</li>
                        <li>• Recommended size: 150x150px for best quality</li>
                        <li>• Square or centered images work best</li>
                      </ul>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM224 176C250.5 176 272 197.5 272 224C272 250.5 250.5 272 224 272C197.5 272 176 250.5 176 224C176 197.5 197.5 176 224 176zM368 288C376.4 288 384.1 292.4 388.5 299.5L476.5 443.5C481 450.9 481.2 460.2 477 467.8C472.8 475.4 464.7 480 456 480L184 480C175.1 480 166.8 475 162.7 467.1C158.6 459.2 159.2 449.6 164.3 442.3L220.3 362.3C224.8 355.9 232.1 352.1 240 352.1C247.9 352.1 255.2 355.9 259.7 362.3L286.1 400.1L347.5 299.6C351.9 292.5 359.6 288.1 368 288.1z" />
                    </svg>
                    Select image
                  </Button>
                </div>
                <div className="relative h-42 w-42 object-cover overflow-hidden rounded-[50%] mt-4">
                  <img
                    src={newProfilePicture || photoURL || "/exampleImage.jpg"}
                    className="h-full w-full"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                      <Spinner />
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const url = await uploadImage(file);
                    setNewProfilePicture(url);
                  } catch (err) {
                    console.error("Avatar upload failed:", err);
                    alert("Avatar upload failed");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              <div className="border-t border-neutral-800 p-6">
                <Button
                  onClick={updateProfilePicture}
                  disabled={uploadingPhoto}
                  className="min-w-[85px]"
                >
                  {uploadingPhoto ? <Spinner /> : "Upload"}
                </Button>
              </div>
            </div>

            {/* Change banner */}
            <div className="border border-neutral-800 w-full rounded-lg bg-neutral-900 mb-16">
              <div className="p-6">
                <h3 className="text-md font-semibold">Profile banner</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Inappropriate or offensive images will be removed and may
                  result in account suspension.
                </p>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"dark"}>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                        >
                          <path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM224 256C224 238.3 238.3 224 256 224L320 224C337.7 224 352 238.3 352 256L352 512L384 512C401.7 512 416 526.3 416 544C416 561.7 401.7 576 384 576L256 576C238.3 576 224 561.7 224 544C224 526.3 238.3 512 256 512L288 512L288 288L256 288C238.3 288 224 273.7 224 256z" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=" text-sm">
                      <DropdownMenuLabel>
                        Profile banner guidelines
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <ul className="space-y-1 text-neutral-300 p-2">
                        <li>• Avoid nudity, violence, or hate symbols</li>
                        <li>• Recommended size: 960x300px for best quality</li>
                      </ul>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => fileInputRef1.current?.click()}>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM224 176C250.5 176 272 197.5 272 224C272 250.5 250.5 272 224 272C197.5 272 176 250.5 176 224C176 197.5 197.5 176 224 176zM368 288C376.4 288 384.1 292.4 388.5 299.5L476.5 443.5C481 450.9 481.2 460.2 477 467.8C472.8 475.4 464.7 480 456 480L184 480C175.1 480 166.8 475 162.7 467.1C158.6 459.2 159.2 449.6 164.3 442.3L220.3 362.3C224.8 355.9 232.1 352.1 240 352.1C247.9 352.1 255.2 355.9 259.7 362.3L286.1 400.1L347.5 299.6C351.9 292.5 359.6 288.1 368 288.1z" />
                    </svg>
                    Select image
                  </Button>
                </div>
                <div className="relative h-64 w-full object-cover overflow-hidden rounded-lg mt-4">
                  <img
                    src={newProfileBanner || bannerURL || "/exampleImage.jpg"}
                    alt="banner"
                    className="h-full rounded-lg w-full object-cover  mb-4"
                  />
                  {uploadingBanner && (
                    <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                      <Spinner />
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef1}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingBanner(true);
                  try {
                    const url = await uploadImage(file);
                    setNewProfileBanner(url);
                  } catch (err) {
                    console.error("Banner upload failed:", err);
                    alert("Banner upload failed");
                  } finally {
                    setUploadingBanner(false);
                  }
                }}
              />
              <div className="border-t border-neutral-800 p-6">
                <Button
                  onClick={updateBannerPicture}
                  disabled={uploadingBannerPhoto}
                  className="min-w-[85px]"
                >
                  {uploadingBannerPhoto ? <Spinner /> : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
