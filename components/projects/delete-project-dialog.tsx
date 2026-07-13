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

interface DeleteProjectDialogProps {
  projectId: string;
  projectName: string;
  trigger: React.ReactNode;
}

export default function DeleteProjectDialog({
  projectId,
  projectName,
  trigger,
}: DeleteProjectDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.count
            ? `Tidak bisa menghapus, masih memiliki ${data.count} data terkait`
            : data.error || "Gagal menghapus project"
        );
      }

      toast.success("Project berhasil dihapus");
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
            Hapus project &quot;{projectName}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Project yang masih
            memiliki versi, review, atau data terkait tidak bisa dihapus.
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