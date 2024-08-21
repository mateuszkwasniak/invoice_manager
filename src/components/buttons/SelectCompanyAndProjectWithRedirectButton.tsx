"use client";

import { useProjectStore } from "@/store/project_store";
import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { useRouter } from "next/navigation";

export default function SelectProjectAndCompanyWithRedirectButton({
  projectId,
  companyId,
  href,
  children,
  ...props
}: {
  projectId: string;
  companyId: string;
  href: string;
  children: React.ReactNode;
} & ButtonProps) {
  const router = useRouter();
  const selectProjectAndCompany = useProjectStore(
    (store) => store.selectProject
  );

  return (
    <Button
      onClick={async () => {
        await selectProjectAndCompany(projectId, companyId);
        router.push(href);
      }}
      variant="outline"
      {...props}
    >
      {children}
    </Button>
  );
}
