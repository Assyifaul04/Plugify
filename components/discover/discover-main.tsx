"use client";

import { useState } from "react";
import DiscoverHeader from "./discover-header";
import ProjectGrid, { ProjectWithRelations } from "./project-grid";
import DiscoverPagination from "./discover-pagination";

interface DiscoverMainProps {
  projects: ProjectWithRelations[];
  initialQuery: string;
  initialSort: string;
  initialLimit: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

export default function DiscoverMain({
  projects,
  initialQuery,
  initialSort,
  initialLimit,
  totalResults,
  currentPage,
  totalPages,
}: DiscoverMainProps) {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <>
      <DiscoverHeader
        initialQuery={initialQuery}
        initialSort={initialSort}
        initialLimit={initialLimit}
        totalResults={totalResults}
        currentResults={projects.length}
        currentPage={currentPage}
        totalPages={totalPages}
        view={view}
        onViewChange={setView}
      />

      <ProjectGrid projects={projects} view={view} />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <DiscoverPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </>
  );
}