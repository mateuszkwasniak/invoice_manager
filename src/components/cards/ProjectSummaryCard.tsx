import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Separator } from "../ui/separator";
import Link from "next/link";
import { Gem } from "lucide-react";

export default function ProjectSummaryCard({
  project,
}: {
  project: {
    id: string;
    name: string;
    slug: string;
    companies: {
      id: string;
      name: string;
      slug: string;
    }[];
    createdAt: Date;
  };
}) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-4">
          Projekt: {project.name}
        </CardTitle>
        <CardDescription>
          Podsumowanie projektu z podziałem na firmy
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground">
              Data utworzenia projektu:
            </span>
            <span className="font-semibold">
              {project.createdAt.toLocaleDateString("pl")}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-4">
            <span className="font-semibold text-muted-foreground">
              Firmy realizujące projekt:
            </span>
            {project.companies.length ? (
              <ul className="flex flex-col gap-3.5 ml-2">
                {project.companies.map((company) => (
                  <li
                    key={company.id}
                    className="transition duration-300 hover:opacity-65"
                  >
                    <Link
                      href={`/projects/${project.slug}/${company.slug}`}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Gem />
                      <span className="text-primary">{company.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
