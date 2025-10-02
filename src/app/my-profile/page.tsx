"use client"
import React from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase/config';
import { useUserStore } from '@/store/userStore';
import { Timestamp } from "firebase/firestore";
import { Card } from '@/components/ui/card';

export default function MyProfile() {
  const [authUser] = useAuthState(auth);
  const { email, username, photoURL, bannerURL } = useUserStore();


  if (!authUser) return <div>Please log in</div>;

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="container text-white grid grid-cols-[30%_70%] gap-2">

        {/* left */}
        <div>
          <Card className='flex justify-center items-center gap-0 h-64'>
            {!photoURL ?
              (
              <img 
                className='h-32 w-32 rounded-[50%] mb-2'
                src="exampleImage.jpg" 
                alt="user avatar" />
              )
            :
            (
              <img 
                className='h-32 w-32 rounded-[50%] mb-2'
                src={photoURL} 
                alt="user avatar" />
            )
            }
            <p className='text-2xl font-semibold'>{username}</p>
            <p className='text-neutral-400'>Registration date: 08.10.2025</p> {/* date fix */}
          </Card>
        </div>

        {/* right */}
        <div>
            <img 
              src="./exampleImage.jpg" 
              alt="exampleImage" 
              className='h-64 rounded-xl w-full object-cover border-1 border-neutral-800'
              />
        </div>

        <Card>

        </Card>

        
      </div>
    </div>
  );
}
