'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8 px-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h2>
      <p className="mt-2">{error.message}</p>
      <Button onClick={reset} className="mt-4">
        Coba Lagi
      </Button>
    </div>
  );
}