'use client';

import { usePathname } from 'next/navigation';
import { BreadcrumbPage } from '@/components/ui/breadcrumb';

// Mapping path ke judul
const pageTitles: Record<string, string> = {
  '/dashboard': 'Ringkasan',
  '/dashboard/users': 'Manajemen Pengguna',
  '/dashboard/users/edit': 'Edit Pengguna',
  '/dashboard/reports': 'Laporan',
  '/dashboard/projects': 'Proyek',
  // tambahkan lainnya sesuai kebutuhan
};

// Fungsi untuk mendapatkan judul dari path
function getTitle(pathname: string): string {
  // Cek apakah ada judul spesifik
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Untuk halaman detail user: /dashboard/users/[id]
  const detailMatch = pathname.match(/^\/dashboard\/users\/([^/]+)$/);
  if (detailMatch) {
    return 'Detail Pengguna';
  }

  // Untuk halaman edit user: /dashboard/users/[id]/edit
  const editMatch = pathname.match(/^\/dashboard\/users\/([^/]+)\/edit$/);
  if (editMatch) {
    return 'Edit Pengguna';
  }

  // Fallback: ambil bagian terakhir dari path
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

export function BreadcrumbTitle() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return <BreadcrumbPage>{title}</BreadcrumbPage>;
}