"use client";

import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectTable from "@/components/projects/project-table";
import ProjectFilters from "@/components/projects/project-filters";
import ProjectPagination from "@/components/projects/project-pagination";

interface DashboardProjectsClientProps {
  projects: any[];
  currentPage: number;
  totalPages: number;
  search: string;
  type: string;
  platform: string;
  status: string;
}

export default function DashboardProjectsClient({
  projects,
  currentPage,
  totalPages,
  search,
  type,
  platform,
  status,
}: DashboardProjectsClientProps) {
  const validProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola semua project yang ada di platform
          </p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button className="rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500">
            <PlusIcon className="mr-2 h-4 w-4" />
            Tambah Project
          </Button>
        </Link>
      </div>

      <ProjectFilters
        initialSearch={search}
        initialType={type}
        initialPlatform={platform}
        initialStatus={status}
      />

      <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
        <ProjectTable projects={validProjects} />
      </Suspense>

      <ProjectPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}