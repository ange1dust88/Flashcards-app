import React from "react";
import Link from "next/link";

function Sidebar() {
  return (
    <div className="bg-neutral-950 fixed inset-y-0 left-0 z-50 hidden w-14 hover:w-64 transition-all flex-col border-r lg:flex max-lg:!hidden group overflow-hidden">
      <nav className="flex flex-col items-start justify-between h-full px-2 sm:py-3">
        <div className="w-full space-y-1">
          <Link
            href="/"
            className="flex relative h-9 md:h-8 group-hover:w-full items-center justify-start rounded text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          >
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
          <Link
            href="/create-module"
            className="flex relative h-9 md:h-8 group-hover:w-full items-center justify-start rounded text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          >
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
                <path d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z" />
              </svg>
            </span>
            <span className="absolute left-9 text-white text-sm opacity-0 group-hover:opacity-100 min-w-[200px] transition-all duration-300">
              Create module
            </span>
          </Link>
        </div>

        <Link
          href="/contact-us"
          className="flex relative h-9 md:h-8 group-hover:w-full items-center justify-start rounded text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
        >
          <span className="flex size-9 items-center justify-center">
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
          </span>
          <span className="absolute left-9 text-white text-sm opacity-0 group-hover:opacity-100 min-w-[200px] transition-all duration-300">
            Contact us
          </span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
