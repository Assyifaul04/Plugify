'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EditUserNavProps {
  userId: string;
}

export default function EditUserNav({ userId }: EditUserNavProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.push(`/dashboard/users/${userId}`)}
      className="mb-2"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Kembali ke Detail
    </Button>
  );
}