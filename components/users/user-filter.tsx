'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';

interface UserFilterProps {
  initialRole?: string;
}

export default function UserFilter({ initialRole = '' }: UserFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // State untuk controlled select
  const [selectedRole, setSelectedRole] = useState<string>(initialRole || 'ALL');

  // Sync dengan URL params (untuk kasus browser back/forward)
  useEffect(() => {
    const roleFromUrl = searchParams.get('role') || 'ALL';
    if (roleFromUrl !== selectedRole) {
      setSelectedRole(roleFromUrl);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync dengan prop initialRole jika berubah
  useEffect(() => {
    const newRole = initialRole || 'ALL';
    if (newRole !== selectedRole) {
      setSelectedRole(newRole);
    }
  }, [initialRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (value: string) => {
    // Update state
    setSelectedRole(value);
    
    // Update URL
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
    <Select value={selectedRole} onValueChange={handleChange}>
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