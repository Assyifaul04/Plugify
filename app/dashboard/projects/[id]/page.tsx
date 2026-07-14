import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import ProjectDetailPageClient from "./page-client";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          image: true,
          role: true,
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
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          versionNumber: true,
          name: true,
          channel: true,
          createdAt: true,
          downloadCount: true,
          _count: {
            select: {
              files: true,
            },
          },
        },
      },
      gallery: {
        orderBy: { ordering: 'asc' },
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
    redirect("/dashboard/projects");
  }

  // Serialize BigInt fields
  const serializedProject = {
    ...project,
    downloadCount: project.downloadCount ? Number(project.downloadCount) : 0,
    _count: {
      versions: project._count.versions ? Number(project._count.versions) : 0,
      follows: project._count.follows ? Number(project._count.follows) : 0,
      reviews: project._count.reviews ? Number(project._count.reviews) : 0,
      reports: project._count.reports ? Number(project._count.reports) : 0,
    },
    versions: project.versions.map(v => ({
      ...v,
      downloadCount: v.downloadCount ? Number(v.downloadCount) : 0,
      _count: {
        files: v._count.files ? Number(v._count.files) : 0,
      },
    })),
  };

  return <ProjectDetailPageClient project={serializedProject} />;
}