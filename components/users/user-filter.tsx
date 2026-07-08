'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';

export default function UserFilter({ initialRole = '' }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== 'ALL') {
      params.set('role', value);
    } else {
      params.delete('role');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select defaultValue={initialRole || 'ALL'} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Semua Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Semua Role</SelectItem>
        <SelectItem value={UserRole.USER}>User</SelectItem>
        <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}