'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { License } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
  onSuccess,
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

  // Reset form saat dialog dibuka untuk edit (agar data terisi)
  useEffect(() => {
    if (open && mode === 'edit' && license) {
      reset({
        name: license.name,
        spdxId: license.spdxId || '',
        url: license.url || '',
      });
    }
  }, [open, mode, license, reset]);

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
    <Button className="rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500">
      <Plus className="size-4" />
      Tambah Lisensi
    </Button>
  ) : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Tambah Lisensi Baru' : 'Edit Lisensi'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Buat lisensi baru untuk digunakan pada project.'
                : 'Perbarui informasi lisensi.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lisensi</Label>
              <Input
                id="name"
                placeholder="cth. MIT License"
                {...register('name')}
                className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="spdxId">SPDX ID (opsional)</Label>
              <Input
                id="spdxId"
                placeholder="cth. MIT"
                {...register('spdxId')}
                className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              {errors.spdxId && (
                <p className="text-sm text-red-500">{errors.spdxId.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                SPDX identifier dari{' '}
                <Link
                  href="https://spdx.org/licenses/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline dark:text-orange-400"
                >
                  spdx.org/licenses
                </Link>
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">URL (opsional)</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://opensource.org/licenses/MIT"
                {...register('url')}
                className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-full"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}