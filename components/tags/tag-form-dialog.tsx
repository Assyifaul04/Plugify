'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tag } from '@prisma/client';
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

const formSchema = z.object({
  name: z.string()
    .min(1, 'Nama tag harus diisi')
    .max(50, 'Nama tag maksimal 50 karakter'),
});

type FormValues = z.infer<typeof formSchema>;

interface TagFormDialogProps {
  mode: 'create' | 'edit';
  tag?: Tag;
  trigger?: ReactNode;
  onSuccess?: () => void;
}

// Helper untuk generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function TagFormDialog({ 
  mode, 
  tag, 
  trigger, 
  onSuccess 
}: TagFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tag?.name || '',
    },
  });

  const nameValue = watch('name');
  const slugPreview = nameValue ? generateSlug(nameValue) : '';

  // Reset form saat dialog dibuka untuk edit (agar data terisi)
  useEffect(() => {
    if (open && mode === 'edit' && tag) {
      reset({ name: tag.name });
    }
  }, [open, mode, tag, reset]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const slug = generateSlug(values.name);
      const url = mode === 'create' ? '/api/tags' : `/api/tags/${tag?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name, slug }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Gagal menyimpan tag');
      }

      toast.success(mode === 'create' ? 'Tag berhasil dibuat' : 'Tag berhasil diperbarui');
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

  // Trigger default untuk create (tanpa trigger dari parent)
  const defaultTrigger = mode === 'create' ? (
    <Button className="rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500">
      <Plus className="size-4" />
      Tambah Tag
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
              {mode === 'create' ? 'Tambah Tag Baru' : 'Edit Tag'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Buat tag baru untuk mengelompokkan project.'
                : 'Perbarui informasi tag.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Tag</Label>
              <Input
                id="name"
                placeholder="cth. Adventure"
                {...register('name')}
                className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {nameValue && (
              <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Slug: </span>
                <span className="font-mono font-medium text-foreground">
                  {slugPreview}
                </span>
              </div>
            )}
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