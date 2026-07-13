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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  UserCog,
  UserX,
  UserCheck,
  Trash2,
  Pencil,
  ShieldAlert,
  Users,
} from 'lucide-react';
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

// UserRole sekarang cuma ADMIN dan USER (MODERATOR sudah dihapus dari schema)
const roleStyles: Record<UserRole, string> = {
  ADMIN:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
  USER:
    'bg-muted text-muted-foreground border-transparent',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  ADMIN: <ShieldAlert className="mr-1 size-3" />,
  USER: null,
};

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
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-11 w-[280px] text-xs font-medium tracking-wide text-muted-foreground">
                  Pengguna
                </TableHead>
                <TableHead className="h-11 text-xs font-medium tracking-wide text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="h-11 text-xs font-medium tracking-wide text-muted-foreground">
                  Role
                </TableHead>
                <TableHead className="h-11 text-xs font-medium tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="h-11 w-[60px] text-right text-xs font-medium tracking-wide text-muted-foreground">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <Users className="size-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Belum ada pengguna
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pengguna yang cocok dengan pencarian akan muncul di sini.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="group/row transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="py-3 font-medium">
                      <Link
                        href={`/dashboard/users/${user.id}`}
                        className="group flex items-center gap-3"
                      >
                        <UserAvatar
                          name={user.name}
                          image={user.image}
                          className="size-9 shrink-0 ring-1 ring-border"
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-foreground group-hover:underline underline-offset-4">
                            {user.name || 'Tanpa Nama'}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            @{user.username}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[user.role]}`}
                      >
                        {roleIcons[user.role]}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.suspended ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                          <span className="size-1.5 rounded-full bg-red-500" />
                          Disuspend
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-colors hover:bg-accent hover:text-accent-foreground focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/row:opacity-100 data-[state=open]:opacity-100 data-[state=open]:bg-accent"
                            aria-label={`Aksi untuk ${user.name || user.username}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/users/${user.id}/edit`}
                              className="flex items-center"
                            >
                              <Pencil className="mr-2 size-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDialog(user, 'role')}>
                            <UserCog className="mr-2 size-4" /> Ubah Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDialog(user, 'suspend')}>
                            {user.suspended ? (
                              <UserCheck className="mr-2 size-4" />
                            ) : (
                              <UserX className="mr-2 size-4" />
                            )}
                            {user.suspended ? 'Aktifkan' : 'Suspend'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openDialog(user, 'delete')}
                          >
                            <Trash2 className="mr-2 size-4" /> Hapus
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
      </div>

      {/* Dialog Components */}
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