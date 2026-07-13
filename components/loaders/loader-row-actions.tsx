"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoaderFormDialog from "./loader-form-dialog";
import DeleteLoaderDialog from "./delete-loader-dialog";

interface LoaderRowActionsProps {
  loader: {
    id: string;
    name: string;
    icon: string | null;
  };
}

export default function LoaderRowActions({ loader }: LoaderRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <LoaderFormDialog
        mode="edit"
        loaderId={loader.id}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <PencilIcon className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        }
      />
      <DeleteLoaderDialog
        loaderId={loader.id}
        loaderName={loader.name}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        }
      />
    </div>
  );
}