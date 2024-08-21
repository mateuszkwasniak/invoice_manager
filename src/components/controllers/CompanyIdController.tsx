"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useProjectStore } from "@/store/project_store";

export default function CompanyIdController() {
  const router = useRouter();
  const selectedCompany = useProjectStore((store) => store.selectedCompany);
  const selectedProject = useProjectStore((store) => store.selectedProject);
  const searchParams = useSearchParams();
  const companyId = searchParams?.get("cid");
  const projectId = searchParams?.get("pid");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/payments" || pathname === "/summary") {
      if (projectId && selectedProject && selectedProject?.id !== projectId) {
        router.replace(`${pathname}?pid=${selectedProject.id}`);
      } else if (
        companyId &&
        selectedCompany &&
        selectedCompany?.id !== companyId
      ) {
        router.replace(`${pathname}?cid=${selectedCompany.id}`);
      }
    }
  }, [
    selectedCompany,
    selectedProject,
    companyId,
    projectId,
    router,
    pathname,
  ]);

  return <></>;
}
