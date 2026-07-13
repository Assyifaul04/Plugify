'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface TagSearchProps {
  initialSearch: string;
}

export default function TagSearch({ initialSearch }: TagSearchProps) {
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
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari tag..."
        defaultValue={initialSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-10 rounded-lg border-border bg-muted/40 pl-9 pr-9 text-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-orange-600/40 focus-visible:ring-offset-0"
      />
      {initialSearch && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}