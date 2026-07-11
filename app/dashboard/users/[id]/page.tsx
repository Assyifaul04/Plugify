import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import UserDetail from '@/components/users/user-detail';
import { notFound } from 'next/navigation';

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const isOwner = session?.user?.id === params.id;

  if (!isAdmin && !isOwner) {
    redirect('/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      projects: true,
      teamMembers: true,
      organizations: true,
      reviews: true,
      follows: true,
    },
  });

  if (!user) {
    notFound();
  }

  // Sembunyikan data sensitif jika bukan admin
  const displayUser = isAdmin ? user : {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    bio: user.bio,
    createdAt: user.createdAt,
    // tidak tampilkan email, role, suspended
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <UserDetail user={displayUser} isAdmin={isAdmin} />
    </div>
  );
}