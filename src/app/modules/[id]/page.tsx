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
  console.log(data);

  if (!data || !data.module) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-neutral-950 text-white flex justify-center items-center">
        <p className="text-neutral-400 text-lg">Module not found</p>
      </div>
    );
  }

  const { module, author } = data;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral text-white flex justify-center items-start">
      <div className="container">
        <div className="grid grid-cols-[1fr_0.5fr_0.5fr] gap-8">
          <ModuleHeader
            title={module.title}
            description={module.description}
            imageUrl={module.imageUrl}
            authorUid={module.authorUid}
            moduleId={module.id}
          />

          <AuthorCard
            username={author?.username || ""}
            image={author?.photoURL}
          />

          <Card className="mt-8 flex flex-col gap-4 p-4 min-h-32">
            <TestModeButton moduleId={module.id} link={"definition-test"}>
              <div className="flex gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  className="h-5 w-5"
                  height="1em"
                  width="1em"
                >
                  <path d="M432.5 82.3L382.4 132.4L507.7 257.7L557.8 207.6C579.7 185.7 579.7 150.3 557.8 128.4L511.7 82.3C489.8 60.4 454.4 60.4 432.5 82.3zM343.3 161.2L342.8 161.3L198.7 204.5C178.8 210.5 163 225.7 156.4 245.5L67.8 509.8C64.9 518.5 65.9 528 70.3 535.8L225.7 380.4C224.6 376.4 224.1 372.3 224.1 368C224.1 341.5 245.6 320 272.1 320C298.6 320 320.1 341.5 320.1 368C320.1 394.5 298.6 416 272.1 416C267.8 416 263.6 415.4 259.7 414.4L104.3 569.7C112.1 574.1 121.5 575.1 130.3 572.2L394.6 483.6C414.3 477 429.6 461.2 435.6 441.3L478.8 297.2L478.9 296.7L343.4 161.2z" />
                </svg>
                Definition test
              </div>
            </TestModeButton>
            <TestModeButton moduleId={module.id} link={"multiple-choice"}>
              <div className="flex gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  className="h-5 w-5"
                  height="1em"
                  width="1em"
                >
                  <path d="M348 62.7C330.7 52.7 309.3 52.7 292 62.7L207.8 111.3C190.5 121.3 179.8 139.8 179.8 159.8L179.8 261.7L91.5 312.7C74.2 322.7 63.5 341.2 63.5 361.2L63.5 458.5C63.5 478.5 74.2 497 91.5 507L175.8 555.6C193.1 565.6 214.5 565.6 231.8 555.6L320.1 504.6L408.4 555.6C425.7 565.6 447.1 565.6 464.4 555.6L548.5 507C565.8 497 576.5 478.5 576.5 458.5L576.5 361.2C576.5 341.2 565.8 322.7 548.5 312.7L460.2 261.7L460.2 159.8C460.2 139.8 449.5 121.3 432.2 111.3L348 62.7zM296 356.6L296 463.1L207.7 514.1C206.5 514.8 205.1 515.2 203.7 515.2L203.7 409.9L296 356.6zM527.4 357.2C528.1 358.4 528.5 359.8 528.5 361.2L528.5 458.5C528.5 461.4 527 464 524.5 465.4L440.2 514C439 514.7 437.6 515.1 436.2 515.1L436.2 409.8L527.4 357.2zM412.3 159.8L412.3 261.7L320 315L320 208.5L411.2 155.9C411.9 157.1 412.3 158.5 412.3 159.9z" />
                </svg>
                Multiple choice test
              </div>
            </TestModeButton>
            <TestModeButton moduleId={module.id} link={"match"}>
              <div className="flex gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  className="h-5 w-5"
                  height="1em"
                  width="1em"
                >
                  <path d="M480 160L480 224L416 224L416 160L480 160zM480 288L480 352L416 352L416 288L480 288zM480 416L480 480L416 480L416 416L480 416zM352 352L288 352L288 288L352 288L352 352zM288 416L352 416L352 480L288 480L288 416zM224 352L160 352L160 288L224 288L224 352zM160 416L224 416L224 480L160 480L160 416zM160 224L160 160L224 160L224 224L160 224zM288 224L288 160L352 160L352 224L288 224zM160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96z" />
                </svg>
                Match
              </div>
            </TestModeButton>
          </Card>
        </div>

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
