"use client";

import { PencilIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteProjectDialog from "./delete-project-dialog";

interface ProjectRowActionsProps {
  project: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProjectRowActions({ project }: ProjectRowActionsProps) {
  if (!project || typeof project !== 'object' || !project.id) {
    console.warn('Invalid project data in ProjectRowActions:', project);
    return null;
  }

  const safeProject = {
    id: project.id || '',
    name: project.name || 'Unnamed',
    slug: project.slug || '',
  };

  if (!safeProject.id) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        asChild
      >
        <Link href={`/dashboard/projects/${safeProject.id}`}>
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        asChild
      >
        <Link href={`/dashboard/projects/${safeProject.id}/edit`}>
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
      <DeleteProjectDialog
        projectId={safeProject.id}
        projectName={safeProject.name}
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