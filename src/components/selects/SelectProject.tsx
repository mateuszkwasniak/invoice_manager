"use client";

import { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjectStore } from "@/store/project_store";
import { CommandList } from "cmdk";

export function SelectProject() {
  const [open, setOpen] = useState(false);
  const projects = useProjectStore((store) => store.projects);
  const selectedProject = useProjectStore((store) => store.selectedProject);
  const setSelectedProject = useProjectStore((store) => store.selectProject);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="dark:bg-zinc-900">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProject
            ? projects?.find((project) => project?.id === selectedProject?.id)
                ?.name
            : "Wybierz projekt..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] lg:w-[336px] p-0">
        <Command>
          <CommandInput
            placeholder="Wyszukaj projekt..."
            className="pl-2 h-9"
          />
          <CommandList>
            <CommandEmpty>Nie znaleziono projektu.</CommandEmpty>
            <CommandGroup>
              {projects?.map((project) => (
                <CommandItem
                  key={project?.id}
                  value={project?.name}
                  onSelect={(currentValue) => {
                    if (currentValue !== selectedProject?.name) {
                      setSelectedProject(project?.id);
                    }
                    setOpen(false);
                  }}
                >
                  {project?.name}
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      selectedProject?.id === project?.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
