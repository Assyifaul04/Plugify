"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameVersionFormDialog from "./game-version-form-dialog";
import DeleteGameVersionDialog from "./delete-game-version-dialog";

interface GameVersionRowActionsProps {
  gameVersion: {
    id: string;
    version: string;
  };
}

export default function GameVersionRowActions({
  gameVersion,
}: GameVersionRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <GameVersionFormDialog
        mode="edit"
        gameVersionId={gameVersion.id}
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
      <DeleteGameVersionDialog
        gameVersionId={gameVersion.id}
        gameVersionLabel={gameVersion.version}
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