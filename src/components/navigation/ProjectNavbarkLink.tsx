"use client";

import React from "react";
import Link from "next/link";
import { useProjectStore } from "@/store/project_store";

export default function ProjectNavbarLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const selectedProject = useProjectStore((store) => store.selectedProject);

  const to =
    selectedProject && selectedProject?.id !== "-1"
      ? `/${href}?pid=${selectedProject.id}`
      : "#";

  return (
    <Link href={to} legacyBehavior passHref className="w-full">
      {children}
    </Link>
  );
}
