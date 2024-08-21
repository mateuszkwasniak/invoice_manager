"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjectStore } from "@/store/project_store";

export function SelectCompany() {
  const [open, setOpen] = React.useState(false);
  const companies = useProjectStore((store) => store.companies);
  const selectedCompany = useProjectStore((store) => store.selectedCompany);
  const setSelectedCompany = useProjectStore((store) => store.selectCompany);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="dark:bg-zinc-900">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCompany && selectedCompany.id !== "-1"
            ? companies?.find((company) => company?.id === selectedCompany?.id)
                ?.name
            : "Wybierz firmę..."}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] lg:w-[336px] p-0">
        <Command>
          <CommandInput placeholder="Wyszukaj firmę..." className="h-9 pl-2" />
          <CommandList>
            <CommandEmpty>Nie znaleziono firmy</CommandEmpty>
            <CommandGroup>
              {companies?.map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.name}
                  onSelect={(currentValue) => {
                    if (currentValue !== selectedCompany?.name) {
                      setSelectedCompany(company.id);
                    }
                    setOpen(false);
                  }}
                >
                  {company.name}
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      selectedCompany?.id === company.id
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
