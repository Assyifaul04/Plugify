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
  ShieldCheck,
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

const roleStyles: Record<UserRole, string> = {
  ADMIN:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
  MODERATOR:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
  USER:
    'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  ADMIN: <ShieldAlert className="mr-1 h-3 w-3" />,
  MODERATOR: <ShieldCheck className="mr-1 h-3 w-3" />,
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
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[280px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pengguna
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Role
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="w-[60px] text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Users className="h-6 w-6 text-muted-foreground" />
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
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/users/${user.id}`}
                        className="group flex items-center gap-3"
                      >
                        <UserAvatar
                          name={user.name}
                          image={user.image}
                          className="h-9 w-9 ring-2 ring-background shadow-sm"
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-foreground group-hover:underline">
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
                        className={`inline-flex items-center font-medium ${roleStyles[user.role]}`}
                      >
                        {roleIcons[user.role]}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.suspended ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Disuspend
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger >
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label={`Aksi untuk ${user.name || user.username}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem >
                            <Link
                              href={`/dashboard/users/${user.id}/edit`}
                              className="flex items-center"
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDialog(user, 'role')}>
                            <UserCog className="mr-2 h-4 w-4" /> Ubah Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDialog(user, 'suspend')}>
                            {user.suspended ? (
                              <UserCheck className="mr-2 h-4 w-4" />
                            ) : (
                              <UserX className="mr-2 h-4 w-4" />
                            )}
                            {user.suspended ? 'Aktifkan' : 'Suspend'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/40"
                            onClick={() => openDialog(user, 'delete')}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
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