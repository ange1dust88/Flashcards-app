'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { Label } from '@/components/ui/label';
import { createUser } from '../firebase/users';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); 
  const router = useRouter();
  const [user] = useAuthState(auth);


  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');



  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleSignUp = async () => {
  let hasError = false;

  if (email === "") {
    setEmailError("Email is necessary");
    hasError = true;
  } else if (!isValidEmail(email)) {
    setEmailError("Invalid email format");
    hasError = true;
  } else {
    setEmailError("");
  }
  //add email taken
  

  if(username === ""){
    setUsernameError("Username is necessary");
    hasError = true;
  }else{
    setUsernameError("");
  }
  //add username is taken


  if (password !== confirmPassword) {
    setConfirmPasswordError("Passwords do not match");
    hasError = true;
  }

  if(password.length < 8 ) {
    setPasswordError("Password should have at least 8 symbols")
    hasError = true;
  }else{
    setPasswordError('');
  }

  if (hasError) {
    return; 
  }

  try {
    const res = await createUserWithEmailAndPassword(email, password);
    if (!res || !res.user) return;

    await createUser(
      res.user.uid,
      res.user.email!,
      username,
    );

    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    router.push('./dashboard');
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="bg-neutral-950 flex justify-center items-center h-screen">
      <Card className="bg-neutral-950 container w-full grid grid-cols-2 p-0 m-0 gap-0 box-border overflow-clip">  
  
        <div className="flex justify-center items-center border-r py-12 border-neutral-800">
          <div className="space-y-4 max-w-80 w-full">
            <h2 className="text-3xl font-semibold text-center">Create account</h2>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Label htmlFor="email">
                <span className="text-neutral-400">This will be your login credential</span>
              </Label>
              <Input
                id="email"
                placeholder="mail@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError ? (
                <span className="text-red-500 text-sm">{emailError}</span>
              )
              :
              (
                <></>
              )
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Display name <span className="text-red-500">*</span></Label>
              <Label htmlFor="username">
                <span className="text-neutral-400">Your username</span>
              </Label>
              <Input
                id="username"
                placeholder=""
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                
              />

              {usernameError ? (
                <span className="text-red-500 text-sm">{usernameError}</span>
              )
              :
              (
                <></>
              )
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                placeholder=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
              />

              {passwordError ? (
                <span className="text-red-500 text-sm">{passwordError}</span>
              )
              :
              (
                <></>
              )
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password <span className="text-red-500">*</span></Label>
              <Input
                id="confirmPassword"
                placeholder=""
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                
              />
              {confirmPasswordError ? (
                <span className="text-red-500 text-sm">{confirmPasswordError}</span>
              )
              :
              (
                <></>
              )
              }
            </div>
            
            <Button 
              className="w-full" 
              onClick={(e) => {
                e.preventDefault();
                handleSignUp();
              }}
            > 
              Create account
            </Button>

           
            <div className='text-center text-sm '>
              Have an account?
              <span 
                className='ml-1 pb-0.5 border-b-1 border-white cursor-pointer hover:text-neutral-200 hover:border-neutral-200 transition-all '
                onClick={() => router.push('/sign-in')}
              >
                Sign in
              </span>
            </div>
          
          </div>
        </div>
 
        <div className="bg-red-200">
          <img src="./exampleImage.jpg" alt="Sign up visual" className="w-full h-full object-cover" />
        </div>
      </Card>
    </div>
  );
}
