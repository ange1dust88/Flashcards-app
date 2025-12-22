"use client";

import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import Search from "./Search";
import Link from "next/link";

function Header() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { username, photoURL, clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearUser();
      //router.push("/sign-in");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 backdrop-blur bg-neutral-950\10">
      <div className="flex justify-between items-center container mx-auto h-16 rounded-xl">
        <div className="flex items-center gap-8">
          <div>
            <Link href="/" className="text-3xl font-extrabold">
              Logo
            </Link>
          </div>
          <Search />
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" className="mr-4">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="size-3"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path>
            </svg>
            Contact us
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={photoURL || "/exampleImage.jpg"}
                  alt="avatar"
                  className="h-10 w-10 rounded-[50%]"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 p-0" align="end">
                <DropdownMenuLabel className="px-4 pt-6">
                  {username}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push(`/profile/${username}`)}
                  className=" px-4 py-2 mt-2 text-muted-foreground transition-colors hover:text-foreground rounded-none flex justify-between items-center"
                >
                  My profile
                  <DropdownMenuShortcut>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      fill="currentColor"
                    >
                      <path d="M470.5 463.6C451.4 416.9 405.5 384 352 384L288 384C234.5 384 188.6 416.9 169.5 463.6C133.9 426.3 112 375.7 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320C528 375.7 506.1 426.2 470.5 463.6zM430.4 496.3C398.4 516.4 360.6 528 320 528C279.4 528 241.6 516.4 209.5 496.3C216.8 459.6 249.2 432 288 432L352 432C390.8 432 423.2 459.6 430.5 496.3zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 304C297.9 304 280 286.1 280 264C280 241.9 297.9 224 320 224C342.1 224 360 241.9 360 264C360 286.1 342.1 304 320 304zM232 264C232 312.6 271.4 352 320 352C368.6 352 408 312.6 408 264C408 215.4 368.6 176 320 176C271.4 176 232 215.4 232 264z" />
                    </svg>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className=" px-4 py-2 text-muted-foreground transition-colors hover:text-foreground rounded-none flex justify-between items-center"
                >
                  Profile settings
                  <DropdownMenuShortcut>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      fill="currentColor"
                    >
                      <path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" />
                    </svg>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-4 py-2 mb-2 text-muted-foreground transition-colors hover:text-foreground rounded-none flex justify-between items-center"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                onClick={() => router.push("/sign-in")}
                variant="secondary"
              >
                Login
              </Button>
              <Button onClick={() => router.push("/sign-up")}>
                Create account
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
