"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import Link from "next/dist/client/link";

function Sidebar() {
  const router = useRouter();
  
  return (
    <div className='bg-neutral-950 fixed inset-y-0 left-0 z-50 hidden w-14 hover:w-64 transition-all flex-col border-r lg:flex max-lg:!hidden group overflow-hidden'>
      <nav className="flex flex-col items-start gap-1 px-2 sm:py-3">
        <Link href="/dashboard" className="flex relative h-9 md:h-8 group-hover:w-full items-center justify-start rounded text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
            <span className="flex size-9 items-center justify-center">
                <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M12.97 2.59a1.5 1.5 0 0 0-1.94 0l-7.5 6.363A1.5 1.5 0 0 0 3 10.097V19.5A1.5 1.5 0 0 0 4.5 21h4.75a.75.75 0 0 0 .75-.75V14h4v6.25c0 .414.336.75.75.75h4.75a1.5 1.5 0 0 0 1.5-1.5v-9.403a1.5 1.5 0 0 0-.53-1.144l-7.5-6.363Z" />
                </svg>
            </span>
            <span className="absolute left-9 text-white text-sm opacity-0 group-hover:opacity-100 min-w-[200px] transition-all duration-300">
                Home
            </span>
        </Link>
        <Link href="/create-module" className="flex relative h-9 md:h-8 group-hover:w-full items-center justify-start rounded text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
            <span className="flex size-9 items-center justify-center">
                <svg 
                stroke="currentColor"
                fill="currentColor"
                className="h-5 w-5"
                strokeWidth="0"
                height="1em"
                width="1em"
                viewBox="0 0 640 640"
                xmlns="http://www.w3.org/2000/svg" 
                >
                <path d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/>
                </svg>
                
            </span>
            <span className="absolute left-9 text-white text-sm opacity-0 group-hover:opacity-100 min-w-[200px] transition-all duration-300">
                Create module
            </span>
        </Link>
      </nav>


    </div>
  );
}

export default Sidebar;
