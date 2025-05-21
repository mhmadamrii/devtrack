import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function ProjectCardsSkeleton() {
  // Create an array of 3 elements to display 3 skeleton cards
  const skeletonCards = Array.from({ length: 3 }, (_, i) => i);

  return (
    <>
      {skeletonCards.map((index) => (
        <Card key={index} className="overflow-hidden border-border">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-5 w-[100px] mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-3/4 mt-2 mb-4" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full mt-2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[180px]" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default ProjectCardsSkeleton;