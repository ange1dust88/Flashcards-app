'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  
  const router = useRouter();
  return (
    <div className="h-full relative bg-neutral-950">
   
      <main className="flex justify-center flex-col items-center ">


        {/* hero */}
        <div className="container h-[80vh] flex justify-start items-center flex-col pt-24">
          <h1 className="text-5xl font-bold">Study tools that teach, not tell</h1>
          <p className="text-xl mt-6 mb-2 max-w-3xl text-center">Build confidence and master every subject with Quizlet’s interactive flashcards, personalized practice tests, and engaging study games.</p>
          <div className="flex flex-col  gap-4 py-6">
            <Button onClick={() => router.push('/sign-up')}>
              <p className="px-4 py-2">
                Sign up for free
              </p>
            </Button>
            <Button>I'm a teacher</Button>
          </div>

          {/* hero cards */}
          <div className="flex gap-4">
            <Card>
              <div className="min-w-md min-h-72 py-4 px-6">
                FHFFH
              </div>
            </Card>
            <Card>
              <div className="min-w-md py-4 px-6">
                FHFFH
              </div>
            </Card>
            <Card>
              <div className="min-w-md py-4 px-6">
                FHFFH
              </div>
            </Card>
          </div>
        </div>

        {/* info block */}
        



        


      </main>
    </div>
  );
}
