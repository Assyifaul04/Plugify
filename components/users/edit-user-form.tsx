'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Import type dari file terpisah, bukan dari @prisma/client
import type { UserRole } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Schema dengan nilai enum hardcoded
const formSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(3, 'Minimal 3 karakter').optional(),
  email: z.string().email('Email tidak valid').optional(),
  bio: z.string().optional(),
  image: z.string().url('URL tidak valid').optional().or(z.literal('')),
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserFormProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    bio: string | null;
    image: string | null;
    role: UserRole;
  };
  canChangeRole: boolean;
}

export default function EditUserForm({
  user,
  canChangeRole,
}: EditUserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      bio: user.bio ?? '',
      image: user.image ?? '',
      role: user.role,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      // Siapkan data yang akan dikirim
      const submitData = canChangeRole 
        ? values // Admin bisa kirim semua termasuk role
        : { // User biasa hanya kirim field tertentu
            name: values.name,
            username: values.username,
            email: values.email,
            bio: values.bio,
            image: values.image,
          };

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Gagal update');
      }

      toast.success('User berhasil diperbarui');
      
      // Redirect ke halaman detail user
      router.push(`/dashboard/users/${user.id}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Gagal update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nama */}
      <Field>
        <FieldContent>
          <FieldLabel>Nama</FieldLabel>
          <Input
            placeholder="Nama lengkap"
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      {/* Username */}
      <Field>
        <FieldContent>
          <FieldLabel>Username</FieldLabel>
          <Input
            placeholder="username"
            {...register('username')}
          />
          <FieldError errors={[errors.username]} />
        </FieldContent>
      </Field>

      {/* Email */}
      <Field>
        <FieldContent>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            placeholder="email@example.com"
            {...register('email')}
          />
          <FieldError errors={[errors.email]} />
        </FieldContent>
      </Field>

      {/* Bio */}
      <Field>
        <FieldContent>
          <FieldLabel>Bio</FieldLabel>
          <Textarea
            placeholder="Tentang dirimu..."
            {...register('bio')}
          />
          <FieldError errors={[errors.bio]} />
        </FieldContent>
      </Field>

      {/* Image */}
      <Field>
        <FieldContent>
          <FieldLabel>URL Foto Profil</FieldLabel>
          <Input
            placeholder="https://..."
            {...register('image')}
          />
          <FieldError errors={[errors.image]} />
        </FieldContent>
      </Field>

      {/* Role - Hanya untuk admin */}
      {canChangeRole && (
        <Field>
          <FieldContent>
            <FieldLabel>Role</FieldLabel>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.role]} />
          </FieldContent>
        </Field>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/dashboard/users/${user.id}`)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}