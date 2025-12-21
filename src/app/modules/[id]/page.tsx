import LearningCard from "@/components/ui/learning-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AuthorCard from "@/components/ui/author-card";
import ModuleHeader from "@/components/ui/module-header";
import { Card } from "@/components/ui/card";
import TestModeButton from "@/components/ui/test-mode-button";

interface ModulePageProps {
  params: { id: string };
}

const getModuleData = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/modules/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch module:", await res.text());
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch module:", err);
    return null;
  }
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { id } = params;
  const data = await getModuleData(id);

  if (!data || !data.module) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="text-neutral-400 text-lg">Module not found</p>
      </div>
    );
  }

  const { module, user } = data;

  return (
    <div className="min-h-screen bg-neutral text-white flex justify-center items-start">
      <div className="container">
        <div className="grid grid-cols-[minmax(0,5fr)_1fr] gap-8">
          <ModuleHeader
            title={module.title}
            description={module.description}
            imageUrl={module.imageUrl}
            authorUid={module.authorUid}
            moduleId={module.id}
          />

          <AuthorCard
            username={module.authorUsername || user?.username || ""}
            image={user?.photoURL}
          />
        </div>

        <Card className="mt-8 grid grid-cols-[1fr_1fr_1fr] gap-4 p-4 min-h-32">
          <TestModeButton moduleId={module.id} link={"definition-test"}>
            Definition test
          </TestModeButton>
          <TestModeButton moduleId={module.id} link={"multiple-choice"}>
            Multiple choice test
          </TestModeButton>
          <TestModeButton moduleId={module.id} link={"match"}>
            Match
          </TestModeButton>
        </Card>

        <Carousel className="w-full h-full flex flex-col justify-center mt-8 pb-16">
          <CarouselContent>
            {module.wordList.map((word: any, i: number) => (
              <CarouselItem key={i} className="h-120">
                <LearningCard
                  key={i}
                  term={word.term}
                  definition={word.definition}
                  imageUrl={word.imageUrl}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
