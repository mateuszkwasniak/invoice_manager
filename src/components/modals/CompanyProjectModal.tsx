import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SelectProject } from "../selects/SelectProject";
import { SelectCompany } from "../selects/SelectCompany";
import AddProjectModal from "./AddProjectModal";
import AddCompanyModal from "./AddCompanyModal";
import CompanyProjectModalTrigger from "./ProjectCompanyModalTrigger";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function CompanyProjectSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="text-primary hover:bg-accent border-border/60 shadow-sm"
          variant="outline"
        >
          <CompanyProjectModalTrigger />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto bg-background">
        <SheetHeader>
          <SheetTitle>Firmy i projekty</SheetTitle>
          <SheetDescription>
            Wybierz projekt oraz firmę, możesz także dodać nowe.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-8 mt-12">
          <div className="w-full flex flex-col gap-4">
            <SelectProject />
            <AddProjectModal />
          </div>
          <Separator className="shadow-sm" />
          <div className="w-full flex flex-col gap-4">
            <SelectCompany />
            <AddCompanyModal />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
