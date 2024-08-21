"use client";

import React from "react";
import { NavigationMenuItem } from "../ui/navigation-menu";
import { useProjectStore } from "@/store/project_store";

export default function CustomNavigationMenuItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const selectedCompany = useProjectStore((store) => store.selectedCompany);

  return (
    <NavigationMenuItem
      className={`[&:hover>svg]:translate-y-[-10%] ${
        !selectedCompany || selectedCompany?.id === "-1"
          ? "opacity-100 w-0"
          : "opacity-100 w-auto"
      } ${className && className}`}
    >
      {!selectedCompany || selectedCompany?.id === "-1" ? null : children}
    </NavigationMenuItem>
  );
}
