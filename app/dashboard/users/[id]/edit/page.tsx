import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import EditUserForm from '../../users/edit-user-form';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const isOwner = session?.user?.id === params.id;

  if (!isAdmin && !isOwner) {
    redirect('/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    notFound();
  }

  // Hanya admin yang bisa mengubah role/suspend
  const canChangeRole = isAdmin;

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Pengguna</h1>
      <EditUserForm user={user} canChangeRole={canChangeRole} />
    </div>
  );
}