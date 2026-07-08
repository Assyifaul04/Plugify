'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import UserAvatar from './user-avatar';

interface UserDetailProps {
  user: {
    id: string;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
    role?: string;
    suspended?: boolean;
    createdAt?: Date;
  };
  isAdmin: boolean;
}

export default function UserDetail({ user, isAdmin }: UserDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UserAvatar name={user.name} image={user.image} className="h-20 w-20" />
        <div>
          <h1 className="text-2xl font-bold">{user.name || 'Tanpa Nama'}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
        {isAdmin && (
          <div className="ml-auto flex gap-2">
            <Link href={`/dashboard/users/${user.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
            {isAdmin && user.email && <p><strong>Email:</strong> {user.email}</p>}
            {isAdmin && user.role && (
              <p>
                <strong>Role:</strong>{' '}
                <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'default'}>
                  {user.role}
                </Badge>
              </p>
            )}
            {isAdmin && user.suspended !== undefined && (
              <p>
                <strong>Status:</strong>{' '}
                <Badge variant={user.suspended ? 'destructive' : 'default'}>
                  {user.suspended ? 'Disuspend' : 'Aktif'}
                </Badge>
              </p>
            )}
            <p><strong>Bergabung:</strong> {formatDate(user.createdAt)}</p>
          </CardContent>
        </Card>

        {/* Tampilkan relasi jika diperlukan */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Contoh: proyek, review, dll. */}
            <p>Belum ada data statistik</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}