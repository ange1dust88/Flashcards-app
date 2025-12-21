"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function Search() {
  const [query, setQuery] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!query) {
      setModules([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/modules/search?q=${query}`);
        const data = await res.json();
        setModules(data.modules);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);
  return (
    <div className="relative w-64">
      <Input
        placeholder="Search modules..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-8"
      />

      {focused && (
        <div className="absolute top-full mt-1 w-full z-50">
          {loading && (
            <div className="flex justify-center items-center p-3 border border-neutral-800 rounded-lg bg-neutral-900">
              <Spinner />
            </div>
          )}

          {!loading && modules.length > 0 && (
            <div className="flex flex-col gap-2 p-2 border border-neutral-800 rounded-lg bg-neutral-900">
              {modules.map((m) => (
                <Link
                  key={m.id}
                  href={`/modules/${m.id}`}
                  onMouseDown={(e) => e.preventDefault()}
                  className="p-1 border border-neutral-800 rounded-lg hover:bg-neutral-800 duration-200 flex gap-2"
                >
                  <img
                    src={m.imageUrl || "/exampleImage.jpg"}
                    alt=""
                    className="h-12 w-12 rounded-lg flex-shrink-0 object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="font-medium truncate text-base">
                      {m.title}
                    </h3>
                    <h3 className="text-neutral-400 text-xs line-clamp-1">
                      {m.description}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
