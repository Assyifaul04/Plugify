'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function UserSearch({ initialSearch = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialSearch);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  const onChange = (term: string) => {
    setValue(term);
    handleSearch(term);
  };

  const clear = () => {
    setValue('');
    handleSearch('');
  };

  return (
    <div className="relative max-w-sm flex-1">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari nama, email, atau username..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 pr-8"
        aria-label="Cari pengguna"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Hapus pencarian"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}