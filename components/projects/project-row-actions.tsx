"use client";

import { PencilIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import DeleteProjectDialog from "./delete-project-dialog";

// Dynamic import untuk ProjectFormDialog
const ProjectFormDialog = dynamic(
  () => import("./project-form-dialog"),
  {
    ssr: false,
    loading: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
        <PencilIcon className="h-4 w-4" />
      </Button>
    ),
  }
);

interface ProjectRowActionsProps {
  project: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProjectRowActions({ project }: ProjectRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        asChild
      >
        <Link href={`/dashboard/projects/${project.id}`}>
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Link>
      </Button>
      <ProjectFormDialog
        mode="edit"
        project={project as any}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <PencilIcon className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        }
      />
      <DeleteProjectDialog
        projectId={project.id}
        projectName={project.name}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        }
      />
    </div>
  );
}