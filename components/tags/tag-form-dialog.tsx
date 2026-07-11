'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tag } from '@prisma/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tag?.name || '',
    },
  });

  const nameValue = watch('name');

  // Auto-generate preview slug (optional)
  const slugPreview = nameValue ? generateSlug(nameValue) : '';

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

  const defaultTrigger = mode === 'create' ? (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Tambah Tag
    </Button>
  ) : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Tag Baru' : 'Edit Tag'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nama Tag</Label>
            <Input 
              placeholder="Contoh: Adventure" 
              {...register('name')} 
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {nameValue && (
            <div className="p-3 bg-muted/50 rounded-md text-sm">
              <span className="text-muted-foreground">Slug: </span>
              <span className="font-mono font-medium">{slugPreview}</span>
            </div>
          )}

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