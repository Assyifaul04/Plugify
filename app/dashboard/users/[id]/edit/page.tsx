import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import EditUserForm from '@/components/users/edit-user-form';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import EditUserNav from '@/components/users/edit-user-nav';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  
  // Cek session
  if (!session?.user) {
    redirect('/auth/login');
  }

  const isAdmin = session.user.role === UserRole.ADMIN;
  const isOwner = session.user.id === id;

  // Hanya admin atau pemilik yang bisa edit
  if (!isAdmin && !isOwner) {
    redirect('/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      role: true,
    },
  });

  if (!user) {
    notFound();
  }

  // Hanya admin yang bisa mengubah role
  const canChangeRole = isAdmin;

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <EditUserNav userId={user.id} />
        <h1 className="text-2xl font-bold">Edit Pengguna</h1>
        <p className="text-muted-foreground">
          Edit informasi pengguna {user.name || user.username}
        </p>
      </div>
      <EditUserForm user={user} canChangeRole={canChangeRole} />
    </div>
  );
}