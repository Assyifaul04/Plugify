'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';
import { toast } from 'sonner'; // ✅ ganti dengan sonner

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; role: UserRole; name?: string | null; email?: string | null } | null;
  onSuccess: () => void;
}

export default function ChangeRoleDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: ChangeRoleDialogProps) {
  const [role, setRole] = useState<UserRole>(user?.role || UserRole.USER);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Gagal mengubah role');
      toast.success('Role berhasil diubah'); // ✅ pakai toast.success
      onSuccess();
    } catch (error) {
      toast.error('Gagal mengubah role'); // ✅ pakai toast.error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Role Pengguna</DialogTitle>
          <DialogDescription>
            Pilih role baru untuk{' '}
            <strong>{user?.name || user?.email || 'pengguna'}</strong>.
          </DialogDescription>
        </DialogHeader>
        <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.USER}>User</SelectItem>
            <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}