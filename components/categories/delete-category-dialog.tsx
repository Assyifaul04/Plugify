"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2Icon, Trash2Icon } from "lucide-react";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  trigger: React.ReactNode;
}

export default function DeleteCategoryDialog({
  categoryId,
  categoryName,
  trigger,
}: DeleteCategoryDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.projectCount
            ? `Tidak bisa menghapus, masih dipakai oleh ${data.projectCount} project`
            : data.error || "Gagal menghapus kategori"
        );
      }

      toast.success("Kategori berhasil dihapus");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Hapus kategori &quot;{categoryName}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Kategori yang masih digunakan
            oleh project tidak bisa dihapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            <Trash2Icon className="size-4" />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}