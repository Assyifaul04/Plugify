'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';

export default function UserFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // searchParams adalah satu-satunya sumber kebenaran — otomatis reaktif
  // terhadap perubahan URL (termasuk tombol back/forward browser), jadi
  // tidak perlu useState + useEffect untuk sinkronisasi manual.
  const selectedRole = searchParams.get('role') || 'ALL';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') {
      params.set('role', value);
    } else {
      params.delete('role');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={selectedRole} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Semua Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Semua Role</SelectItem>
        <SelectItem value={UserRole.USER}>User</SelectItem>
        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}