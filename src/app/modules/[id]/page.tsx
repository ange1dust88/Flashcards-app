import { getModuleById } from "@/app/firebase/modules";
import LearningCard from "@/components/ui/learning-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AuthorCard from "@/components/ui/author-card";
import { getUserByUid } from "@/app/firebase/users";
import ModuleHeader from "@/components/ui/module-header";
import { Card } from "@/components/ui/card";
import TestModeButton from "@/components/ui/test-mode-button";

interface ModulePageProps {
  params: { id: string };
}
export default async function ModulePage(props: ModulePageProps) {
  const { id } = await props.params;

  const module = await getModuleById(id);

  const user = await getUserByUid(module?.authorUid!);

  if (!module) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="text-neutral-400 text-lg">Module not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral text-white flex justify-center items-start">
      <div className="container">
        <div className="grid grid-cols-[minmax(0,5fr)_1fr] gap-8">
          {/* module info */}

          <ModuleHeader
            title={module.title}
            description={module.description}
            imageUrl={module.imageUrl}
            authorUid={module.authorUid}
            moduleId={id}
          />

          {/* author info */}
          <AuthorCard
            username={module.authorUsername || user?.username || ""}
            image={user?.photoURL}
          />
        </div>

        <Card className="mt-8 grid grid-cols-[1fr_1fr_1fr] gap-4 p-4 min-h-32">
          <TestModeButton moduleId={id} link={"definition-test"}>
            Definition test
          </TestModeButton>
          <TestModeButton moduleId={id} link={"simple-definition-test"}>
            Multiple choice test
          </TestModeButton>
          <TestModeButton moduleId={id} link={"match"}>
            Match
          </TestModeButton>
        </Card>

        <Carousel className="w-full h-full flex flex-col justify-center mt-8 pb-16">
          <CarouselContent>
            {module.wordList.map((word, i) => (
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
