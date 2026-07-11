'use client';

import { User } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import UserAvatar from '@/components/users/user-avatar';

interface RecentUsersProps {
  users: User[];
}

export default function RecentUsers({ users }: RecentUsersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengguna Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Bergabung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Belum ada pengguna
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2">
                    <UserAvatar name={user.name} image={user.image} className="h-8 w-8" />
                    <span>{user.name || 'Tanpa Nama'}</span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}