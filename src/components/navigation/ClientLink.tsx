"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ClientLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <SquareArrowOutUpRight className="text-muted-foreground hover:text-primary transition duration-300" />
    </Link>
  );
}
