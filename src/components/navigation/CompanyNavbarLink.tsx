"use client";

import React from "react";
import Link from "next/link";
import { useProjectStore } from "@/store/project_store";

export default function CompanyNavbarLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const selectedCompany = useProjectStore((store) => store.selectedCompany);

  const to =
    selectedCompany && selectedCompany?.id !== "-1"
      ? `/${href}?cid=${selectedCompany.id}`
      : "#";

  return (
    <Link href={to} legacyBehavior passHref className="w-full">
      {children}
    </Link>
  );
}
