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

interface DeleteLoaderDialogProps {
  loaderId: string;
  loaderName: string;
  trigger: React.ReactNode;
}

export default function DeleteLoaderDialog({
  loaderId,
  loaderName,
  trigger,
}: DeleteLoaderDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/loaders/${loaderId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.versionCount
            ? `Tidak bisa menghapus, masih dipakai oleh ${data.versionCount} version`
            : data.error || "Gagal menghapus loader"
        );
      }

      toast.success("Loader berhasil dihapus");
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
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Hapus loader &quot;{loaderName}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Loader yang masih digunakan
            oleh version tidak bisa dihapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="rounded-full border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
          >
            {isLoading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            <Trash2Icon className="mr-2 size-4" />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}