// app/(landing)/projects/[slug]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-foreground">Project Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        The project you're looking for doesn't exist or has been removed.
      </p>
      <Button className="mt-6 bg-orange-500 text-white hover:bg-orange-600" asChild>
        <Link href="/discover">Browse Projects</Link>
      </Button>
    </div>
  );
}