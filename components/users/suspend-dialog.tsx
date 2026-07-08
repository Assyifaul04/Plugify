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
import { toast } from 'sonner'; // ← import toast langsung dari sonner

interface SuspendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; suspended: boolean; name?: string | null } | null;
  onSuccess: () => void;
}

export default function SuspendDialog({ open, onOpenChange, user, onSuccess }: SuspendDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspended: !user.suspended }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status suspend');
      
      // Gunakan toast.success / toast.error
      toast.success(user.suspended ? 'User diaktifkan' : 'User disuspend');
      onSuccess();
    } catch (error) {
      toast.error('Gagal mengubah status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user?.suspended ? 'Aktifkan' : 'Suspend'} Pengguna</DialogTitle>
          <DialogDescription>
            {user?.suspended
              ? `Aktifkan kembali akun ${user?.name || 'pengguna'}?`
              : `Yakin ingin menonaktifkan sementara akun ${user?.name || 'pengguna'}?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            variant={user?.suspended ? 'default' : 'destructive'}
            onClick={handleSuspend}
            disabled={loading}
          >
            {loading ? 'Memproses...' : user?.suspended ? 'Aktifkan' : 'Suspend'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}