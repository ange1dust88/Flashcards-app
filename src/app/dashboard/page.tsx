'use client'
import React, { useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase/config'

import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { useUserStore } from '@/store/userStore';




function Dashboard() {
  const [authUser, loading] = useAuthState(auth);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    if (!authUser) return;

    const ref = doc(db, "users", authUser.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setUser(snap.data()); 
        console.log(snap.data());
      }else{
        console.log("no snap:(");
      }
    }, (err) => {
      console.error("Failed to listen user data:", err);
    });

    return () => unsubscribe(); 
  }, [authUser, setUser]);



  if (loading) return <div>Loading...</div>;


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex h-screen justify-center items-center'>
      <div className="bg-neutral-950 w-full h-full container">
        DASHBOARD
      </div>

    {/**
       
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-5xl"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <div className='w-48 h-64'>
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

    */}
    </div>
  )
}

export default Dashboard
