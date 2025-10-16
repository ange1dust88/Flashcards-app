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
          <div className=" bg-neutral-900 p-4 mt-8 border border-neutral-800 rounded-lg w-full flex gap-6 ">
            <div className="flex-shrink-0 h-56 w-56 overflow-hidden rounded-lg">
              <img
                src={module.imageUrl || "/exampleImage.jpg"}
                alt={module.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-semibold">{module.title}</h1>
              <p className="text-neutral-400 break-words break-all">
                {module.description}
              </p>
            </div>
          </div>

          {/* author info */}
          <AuthorCard
            username={module.authorUsername || user?.username || ""}
            image={user?.photoURL}
          />
        </div>

        <Carousel className="w-full h-full flex flex-col justify-center mt-8">
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
