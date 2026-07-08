'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserCog, UserX, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from './user-avatar';
import ChangeRoleDialog from './change-role-dialog';
import SuspendDialog from './suspend-dialog';
import DeleteDialog from './delete-dialog';
import { UserRole } from '@prisma/client';

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  suspended: boolean;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogType, setDialogType] = useState<'role' | 'suspend' | 'delete' | null>(
    null
  );

  const openDialog = (user: User, type: 'role' | 'suspend' | 'delete') => {
    setSelectedUser(user);
    setDialogType(type);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogType(null);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Tidak ada pengguna ditemukan
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-2 hover:underline">
                      <UserAvatar name={user.name} image={user.image} className="h-8 w-8" />
                      <div>
                        <div>{user.name || 'Tanpa Nama'}</div>
                        <div className="text-xs text-muted-foreground">@{user.username}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'MODERATOR' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.suspended ? (
                      <Badge variant="outline" className="text-red-500 border-red-500">Disuspend</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-500 border-green-500">Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {/* ✅ Gunakan div sebagai wrapper, bukan Button */}
                        <div className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/users/${user.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(user, 'role')}>
                          <UserCog className="mr-2 h-4 w-4" /> Ubah Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(user, 'suspend')}>
                          <UserX className="mr-2 h-4 w-4" /> {user.suspended ? 'Aktifkan' : 'Suspend'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDialog(user, 'delete')}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog-dialog */}
      <ChangeRoleDialog
        open={dialogType === 'role' && !!selectedUser}
        onOpenChange={(open) => !open && closeDialog()}
        user={selectedUser}
        onSuccess={closeDialog}
      />
      <SuspendDialog
        open={dialogType === 'suspend' && !!selectedUser}
        onOpenChange={(open) => !open && closeDialog()}
        user={selectedUser}
        onSuccess={closeDialog}
      />
      <DeleteDialog
        open={dialogType === 'delete' && !!selectedUser}
        onOpenChange={(open) => !open && closeDialog()}
        user={selectedUser}
        onSuccess={closeDialog}
      />
    </>
  );
}