import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import ProjectFormPage from "./page-client";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      description: true,
      type: true,
      platform: true,
      status: true,
      iconUrl: true,
      bannerUrl: true,
      sourceUrl: true,
      issuesUrl: true,
      wikiUrl: true,
      discordUrl: true,
      donationUrl: true,
      licenseId: true,
      organizationId: true,
    },
  });

  if (!project) {
    redirect("/dashboard/projects");
  }

  // Serialize BigInt fields
  const serializedProject = {
    ...project,
    downloadCount: project.downloadCount ? Number(project.downloadCount) : 0,
  };

  return <ProjectFormPage mode="edit" project={serializedProject} />;
}