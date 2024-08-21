"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React from "react";
import { Button } from "../ui/button";
import { Loader, Trash2 } from "lucide-react";
import { OctagonAlert } from "lucide-react";

export default function AddCompanyModal({
  triggerVariant,
  onDelete,
  loading,
  title,
  description,
  triggerText,
}: {
  triggerVariant: "icon" | "text";
  onDelete: () => Promise<void>;
  loading: boolean;
  title: string;
  description: string;
  triggerText?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerVariant === "icon" ? (
          <Trash2 className="w-6 h-6 text-red-600 cursor-pointer transition duration-300 hover:opacity-50" />
        ) : (
          <Button
            variant="destructive"
            disabled={loading}
            className="mt-8 ml-auto bg-red-700"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              triggerText || "Usuń"
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="md:w-[600px]">
        <DialogHeader className="mr-4">
          <DialogTitle className="flex items-center gap-3">
            <OctagonAlert className="w-8 h-8 text-red-600" />{" "}
            <p className="!leading-6">{title}</p>
          </DialogTitle>
          <DialogDescription className="text-base ml-10">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            Anuluj
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            variant="destructive"
            className="bg-red-700"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Usuń"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
