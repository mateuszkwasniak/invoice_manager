"use client";

import React, { useEffect, useState } from "react";
import { useProjectStore } from "@/store/project_store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Loader } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import ConfirmRemovalModal from "../modals/ConfirmRemovalModal";
import { Separator } from "../ui/separator";
import Link from "next/link";

export default function CompaniesAndProjectsCard() {
  const [companies, setCompanies] = useState<{
    [key: string]: { id: string; name: string; slug: string }[];
  }>({});
  const [selectedCompany, setSelectedCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedProjectId = useProjectStore(
    (store) => store.selectedProject
  )?.id;
  const projects = useProjectStore((store) => store.projects);
  const storedCompanies = useProjectStore((store) => store.companies);
  const fetchCompanies = useProjectStore(
    (store) => store.fetchUserProjectCompanies
  );
  const deleteProject = useProjectStore((store) => store.deleteProject);
  const deleteCompany = useProjectStore((store) => store.deleteCompany);

  const updateCompanies = async (projectId: string) => {
    const companiesData = await fetchCompanies(projectId);
    setCompanies((prev) => ({ ...prev, [projectId]: companiesData.companies }));
  };

  const onAccordionValueChange = async (value: string) => {
    if (!value) {
      return;
    }
    try {
      if (!companies[value]) {
        updateCompanies(value);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const onProjectDelete = async (projectId: string) => {
    setError("");
    setLoading(true);
    try {
      await deleteProject(projectId);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onCompanyDelete = async (companyId: string, projectId: string) => {
    setError("");
    setLoading(true);

    try {
      await deleteCompany(companyId, projectId);

      if (projectId !== selectedProjectId) {
        setCompanies((prev) => {
          return {
            ...prev,
            [projectId]: prev[projectId].filter(
              (company) => company.id !== companyId
            ),
          };
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      setCompanies((prev) => ({
        ...prev,
        [selectedProjectId]: storedCompanies,
      }));
    }
  }, [storedCompanies]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Projekty i firmy</CardTitle>
        <CardDescription>
          Lista utworzonych projektów i firm - możesz je usuwać lub edytować
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Accordion
          type="single"
          collapsible
          onValueChange={onAccordionValueChange}
        >
          {projects.map((project) => (
            <AccordionItem key={project.id} value={project.id}>
              <AccordionTrigger>
                <p className="text-xl font-semibold">{project.name}</p>
              </AccordionTrigger>
              <AccordionContent className="w-full">
                {!companies || !companies[project.id] ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : companies && !companies[project.id]?.length ? (
                  <p>Brak firm</p>
                ) : (
                  companies &&
                  companies[project.id]?.map((company) => (
                    <div
                      key={company.id}
                      className="w-full py-3 flex items-center gap-4 border-b"
                    >
                      <div className="flex items-center gap-4 ml-4">
                        <Checkbox
                          id={company.id}
                          checked={company.id === selectedCompany}
                          onCheckedChange={(checked) => {
                            checked
                              ? setSelectedCompany(company.id)
                              : setSelectedCompany("");
                          }}
                        />
                        <Link
                          className="text-base font-semibold text-muted-foreground"
                          href={`/projects/${project.slug}/${company.slug}`}
                        >
                          {company.name}
                        </Link>
                      </div>
                      {company.id === selectedCompany && (
                        <ConfirmRemovalModal
                          triggerVariant={"icon"}
                          onDelete={() =>
                            onCompanyDelete(company.id, project.id)
                          }
                          loading={loading}
                          title={`Czy na pewno chcesz usunąć firmę ${company.name}?`}
                          description={"Ta operacja jest nieodwracalna"}
                        />
                      )}
                    </div>
                  ))
                )}
                {error && <p className="text-xs text-red-600">{error}</p>}

                <ConfirmRemovalModal
                  triggerVariant={"text"}
                  triggerText="Usuń projekt"
                  onDelete={() => onProjectDelete(project.id)}
                  loading={loading}
                  title={`Czy na pewno chcesz usunąć projekt ${project.name}?`}
                  description={"Ta operacja jest nieodwracalna"}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
