'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface LicenseSearchProps {
  initialSearch: string;
}

export default function LicenseSearch({ initialSearch }: LicenseSearchProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  const clearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cari lisensi (nama atau SPDX)..."
        defaultValue={initialSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-8 pr-8"
      />
      {initialSearch && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-9 px-2"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}