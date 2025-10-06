'use client'
import React, { useEffect, useState } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase/config'

import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { useUserStore } from '@/store/userStore';
import { getAllModules } from '../firebase/modules'; 
import ModuleCard from '@/components/ui/module-card';



function Dashboard() {
  const [authUser, loading] = useAuthState(auth);
  const setUser = useUserStore((state) => state.setUser);
  const [modules, setModules] = useState<any[]>([]); 
  const router = useRouter();

  useEffect(() => {
    if (!authUser) return;


    const ref = doc(db, "users", authUser.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setUser(snap.data()); 
        console.log("User data:", snap.data());
      } else {
        console.log("No user snapshot :(");
      }
    }, (err) => {
      console.error("Failed to listen user data:", err);
    });

    getAllModules()
      .then(modules => {
        setModules(modules);
        console.log("All modules:", modules);
      })
      .catch(err => {
        console.error("Failed to fetch modules:", err);
      });

    return () => unsubscribe(); 
  }, [authUser, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex h-screen justify-center items-start'>
      <div className="container mt-16">

        <div className='flex gap-6 w-full'>
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              title={mod.title}
              author={mod.author.username} 
              imageUrl={mod.imageUrl ?? ""} 
              length={mod.wordList.length}
            />
          ))}
        </div>

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
