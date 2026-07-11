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
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" />
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
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon className="size-4" />
          </Button>
        }
      />
    </div>
  );
}