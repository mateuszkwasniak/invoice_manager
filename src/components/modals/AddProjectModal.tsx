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
import { Plus } from "lucide-react";
import ProjectForm from "../forms/ProjectForm";

export default function AddProjectModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400">
          <Plus className="w-5 h-5 mr-1" /> Utwórz projekt
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[450px]">
        <DialogHeader>
          <DialogTitle>Utwórz nowy projekt</DialogTitle>
          <DialogDescription>
            Tutaj możesz utworzyć nowy projekt, po wprowadzeniu nazwy kliknij
            &apos;Dodaj&apos;
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <ProjectForm setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
