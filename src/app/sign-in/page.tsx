"use client";
import React, { useState } from "react";

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const router = useRouter();

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSignIn = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log(res);
      setEmail("");
      setPassword("");
      if (res && res.user) {
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="bg-neutral-950 flex justify-center items-center h-screen">
      <Card className="bg-neutral-950 container w-full grid grid-cols-2 p-0 m-0 gap-0 box-border overflow-clip ">
        <div className="flex justify-center items-center border-r border-neutral-800">
          <div className="max-w-80 w-full">
            <form
              className="space-y-4 w-full mb-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSignIn();
              }}
            >
              <h2 className="text-3xl font-semibold text-center">Login</h2>
              <p className="text-md text-neutral-400 text-center">
                Enter your data to login
              </p>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder=""
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder=""
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </form>
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => router.push("/sign-up")}
            >
              Create account
            </Button>

            {error ? (
              <div className="bg-linear-to-br border text-red-500 text-sm border-red-800 rounded-md px-2 py-0.5 from-red-700/30 mt-2">
                {error}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="bg-red-200">
          <img src="/exampleImage.jpg" alt="" className="w-full h-full" />
        </div>
      </Card>
    </div>
  );
}
