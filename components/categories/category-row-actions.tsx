"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryFormDialog from "./category-form-dialog";
import DeleteCategoryDialog from "./delete-category-dialog";

interface CategoryRowActionsProps {
  category: {
    id: string;
    name: string;
    icon: string | null;
  };
}

export default function CategoryRowActions({ category }: CategoryRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <CategoryFormDialog
        mode="edit"
        categoryId={category.id}
        trigger={
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" />
          </Button>
        }
      />
      <DeleteCategoryDialog
        categoryId={category.id}
        categoryName={category.name}
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