"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/store/project_store";
import { ChevronLeft } from "lucide-react";
import { SquareGanttChart } from "lucide-react";

export default function ProjectCompanyModalTrigger() {
  const selectedProjectName =
    useProjectStore((store) => store.selectedProject)?.name || "";

  const selectedCompany = useProjectStore((store) => store.selectedCompany);
  const selectedCompanyName =
    !selectedCompany || selectedCompany.id === "-1" ? "" : selectedCompany.name;
  const fetchUserProjects = useProjectStore((store) => store.fetchUserProjects);
  const triggerTitle =
    !selectedProjectName || !selectedCompanyName
      ? "Wybierz firmę"
      : `${selectedCompanyName} (${selectedProjectName})`;

  useEffect(() => {
    const storeData = localStorage?.getItem("invoice_manager");
    if (!storeData || !JSON.parse(storeData)?.state?.companies?.length) {
      fetchUserProjects();
    }
  }, []);
  return (
    <p className="text-xs md:text-base flex items-center gap-1 group">
      <ChevronLeft className="hidden md:block w-4 h-4 group-hover:translate-x-[-3px] transition duration-300" />
      {triggerTitle}
      <SquareGanttChart
        className={`w-6 h-6 ml-2 ${
          !selectedCompanyName || !selectedProjectName
            ? "hidden"
            : "hidden md:block"
        }`}
      />
    </p>
  );
}
