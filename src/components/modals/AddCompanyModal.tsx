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
import CompanyForm from "../forms/CompanyForm";
import { useProjectStore } from "@/store/project_store";

export default function AddCompanyModal() {
  const [open, setOpen] = React.useState(false);

  const selectedProject = useProjectStore((store) => store?.selectedProject);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!selectedProject?.id}
          className="dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400"
        >
          <Plus className="w-5 h-5 mr-1" /> Utwórz firmę
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen min-h-[75%] min-w-full md:min-w-[900px] p-8 !overflow-y-auto !flex !flex-col !gap-8">
        <DialogHeader className="!h-fit">
          <DialogTitle>
            Dodaj nową firmę do projektu{" "}
            {selectedProject?.name ? selectedProject.name : "projektu"}{" "}
          </DialogTitle>
          <DialogDescription>
            Tutaj możesz utworzyć nową firmę, po wprowadzeniu informacji kliknij
            &apos;Dodaj&apos;
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <CompanyForm setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
