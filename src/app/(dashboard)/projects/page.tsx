import CompaniesAndProjectsCard from "@/components/cards/CompaniesAndProjectsCard";
import React from "react";

export default async function ProjectsPage() {
  return (
    <main>
      <section className="w-full lg:w-[60%]">
        <CompaniesAndProjectsCard />
      </section>
    </main>
  );
}
