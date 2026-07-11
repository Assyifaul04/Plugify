'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { License } from '@prisma/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string()
    .min(1, 'Nama lisensi harus diisi')
    .max(100, 'Nama lisensi maksimal 100 karakter'),
  spdxId: z.string()
    .max(50, 'SPDX ID maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  url: z.string()
    .url('URL tidak valid')
    .optional()
    .or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface LicenseFormDialogProps {
  mode: 'create' | 'edit';
  license?: License;
  trigger?: ReactNode;
  onSuccess?: () => void;
}

export default function LicenseFormDialog({ 
  mode, 
  license, 
  trigger, 
  onSuccess 
}: LicenseFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: license?.name || '',
      spdxId: license?.spdxId || '',
      url: license?.url || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const url = mode === 'create' ? '/api/licenses' : `/api/licenses/${license?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const payload = {
        name: values.name,
        spdxId: values.spdxId || null,
        url: values.url || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Gagal menyimpan lisensi');
      }

      toast.success(mode === 'create' ? 'Lisensi berhasil dibuat' : 'Lisensi berhasil diperbarui');
      setOpen(false);
      reset();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = mode === 'create' ? (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Tambah Lisensi
    </Button>
  ) : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Lisensi Baru' : 'Edit Lisensi'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nama Lisensi</Label>
            <Input 
              placeholder="Contoh: MIT License" 
              {...register('name')} 
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label>SPDX ID (opsional)</Label>
            <Input 
              placeholder="Contoh: MIT" 
              {...register('spdxId')} 
            />
            {errors.spdxId && <p className="text-sm text-red-500">{errors.spdxId.message}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              SPDX identifier dari <a href="https://spdx.org/licenses/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">spdx.org/licenses</a>
            </p>
          </div>

          <div>
            <Label>URL (opsional)</Label>
            <Input 
              type="url"
              placeholder="https://opensource.org/licenses/MIT" 
              {...register('url')} 
            />
            {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Simpan' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}