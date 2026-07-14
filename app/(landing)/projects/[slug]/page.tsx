import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { serializeBigInts } from "@/lib/serializer";
import ProjectDetailClient from "./page-client";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: {
        slug,
        status: ProjectStatus.PUBLISHED,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        license: {
          select: {
            id: true,
            name: true,
            spdxId: true,
            url: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        versions: {
          orderBy: { createdAt: "desc" },
          include: {
            gameVersions: {
              include: {
                gameVersion: true,
              },
            },
            loaders: {
              include: {
                loader: true,
              },
            },
            files: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        gallery: {
          orderBy: { ordering: "asc" },
          select: {
            id: true,
            url: true,
            caption: true,
            isCover: true,
          },
        },
        _count: {
          select: {
            versions: true,
            follows: true,
            reviews: true,
            reports: true,
          },
        },
      },
    });

    if (!project) {
      notFound();
    }

    const serializedProject = serializeBigInts(project);

    return <ProjectDetailClient project={serializedProject} />;
  } catch (error) {
    console.error("Error fetching project:", error);
    // Tampilkan halaman error yang lebih informatif
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-red-500/10 p-4">
          <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Unable to Load Project</h1>
        <p className="mt-2 text-muted-foreground">
          We're having trouble connecting to the database. Please try again later.
        </p>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }
}