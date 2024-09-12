import {
  ActionResponse,
  createCompany,
  createProject,
  deleteCompany,
  deleteProject,
} from "@/actions/actions";
import { generateSlug } from "@/lib/utils/slug";
import { CompanyBudgetFormInput } from "@/schemas/Company";
import { ProjectFormInput } from "@/schemas/Project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProjectStore = {
  projects: { id: string; name: string; slug: string }[];
  selectedProject: { id: string; name: string; slug: string } | null;
  selectProject: (id: string, selectedCompanyId?: string) => Promise<void>;
  createProject: (projectFormInput: ProjectFormInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  companies: { id: string; name: string; slug: string }[];
  selectedCompany: { id: string; name: string; slug: string } | null;
  selectCompany: (id: string) => void;
  createCompany: (
    companyFormInput: CompanyBudgetFormInput,
    filesFormData: FormData | null
  ) => Promise<void>;
  deleteCompany: (companyId: string, projectId: string) => Promise<void>;
  fetchUserProjects: (id?: string) => Promise<void>;
  fetchUserProjectCompanies: (projectId: string) => Promise<{
    companies: { id: string; name: string; slug: string }[];
  }>;
  fetchAndLoadUserProjectCompanies: (
    projectId: string,
    selectedCompanyId?: string
  ) => Promise<void>;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [] as { id: string; name: string; slug: string }[],
      selectedProject: null,
      selectProject: async (id: string, selectedCompanyId?: string) => {
        const selected =
          get().projects.find((project) => project.id === id) || null;

        if (selected) {
          set({
            selectedProject: selected,
          });
          await get().fetchAndLoadUserProjectCompanies(id, selectedCompanyId);
        }
      },
      createProject: async (projectFormInput: ProjectFormInput) => {
        const response: ActionResponse<{
          id: string;
          name: string;
          slug: string;
        }> = await createProject(projectFormInput);

        if (!response.ok) {
          throw new Error(response.message);
        } else {
          if (response?.data) {
            const newProject = {
              ...response.data,
            };
            set((state) => ({
              selectedProject: newProject,
              projects: [...state.projects, newProject].sort((a, b) =>
                a.name > b.name ? 1 : -1
              ),
              selectedCompany: { id: "-1", name: "brak", slug: "-1" },
              companies: [],
            }));
          }

          return;
        }
      },
      deleteProject: async (id: string) => {
        const response: ActionResponse<null> = await deleteProject(id);
        if (!response.ok) {
          throw new Error(response.message);
        } else {
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            selectedProject:
              state?.selectedProject?.id === id ? null : state?.selectedProject,
            companies:
              state?.selectedProject?.id === id ? [] : state?.companies,
            selectedCompany:
              state?.selectedProject?.id === id
                ? { id: "-1", name: "brak", slug: "-1" }
                : state?.selectedCompany,
          }));
        }
      },
      companies: [],
      selectedCompany: null,
      selectCompany: (id: string) => {
        const selected =
          get().companies.find((company) => company.id === id) || null;
        if (selected) {
          set({
            selectedCompany: selected,
          });
        }
      },
      createCompany: async (
        companyFormInput: CompanyBudgetFormInput,
        filesFormData: FormData | null
      ) => {
        const selectedProjectId = get()?.selectedProject?.id;

        if (!selectedProjectId) throw new Error("Brak wybranego projektu!");

        const response: ActionResponse<null> = await createCompany(
          companyFormInput,
          selectedProjectId,
          filesFormData
        );

        if (!response.ok) {
          throw new Error(response.message);
        } else {
          const newCompany = {
            id: response.message,
            name: companyFormInput.companyName,
            slug: generateSlug(companyFormInput.companyName),
          };
          set((state) => ({
            selectedCompany: newCompany,
            companies: [...state.companies, newCompany].sort((a, b) =>
              a.name > b.name ? 1 : -1
            ),
          }));
        }
      },
      deleteCompany: async (companyId: string, projectId: string) => {
        const response: ActionResponse<null> = await deleteCompany(
          companyId,
          projectId
        );
        if (!response.ok) {
          throw new Error(response.message);
        } else {
          if (projectId === get().selectedProject?.id) {
            set((state) => ({
              companies: state?.companies?.filter(
                (company) => company.id !== companyId
              ),
              selectedCompany:
                !state?.selectedCompany ||
                state?.selectedCompany?.id === companyId
                  ? { id: "-1", name: "brak", slug: "-1" }
                  : state?.selectedCompany,
            }));
          }
        }
      },
      fetchUserProjects: async (id?: string) => {
        try {
          const response = await fetch(
            `/api/projects${id ? `?pid=${id}` : ""}`
          );
          if (!response.ok) {
            throw new Error();
          } else {
            const projectsData: {
              projects: { id: string; name: string; slug: string }[];
              companies: { id: string; name: string; slug: string }[];
            } = await response.json();
            set({
              projects: projectsData.projects,
              selectedProject: id
                ? projectsData.projects.find((project) => project?.id === id)
                : projectsData.projects[0],
              companies: projectsData.companies,
              selectedCompany:
                projectsData.companies.length === 0
                  ? { id: "-1", name: "brak", slug: "-1" }
                  : projectsData.companies[0],
            });
          }
        } catch (error) {
          throw new Error(
            "Nie udało się pobrać listy projektów, proszę spróbować później"
          );
        }
      },
      fetchUserProjectCompanies: async (projectId: string) => {
        try {
          const response = await fetch(`/test-api/companies?pid=${projectId}`);

          if (!response.ok) {
            throw new Error();
          } else {
            const companiesData: {
              companies: { id: string; name: string; slug: string }[];
            } = await response.json();

            return companiesData;
          }
        } catch (error) {
          throw new Error(
            "Nie udało się pobrać listy firm dla tego projektu, proszę spróbować później"
          );
        }
      },
      fetchAndLoadUserProjectCompanies: async (
        projectId: string,
        selectedCompanyId?: string
      ) => {
        try {
          const response = await fetch(`/api/companies?pid=${projectId}`);

          if (!response.ok) {
            throw new Error();
          } else {
            const companiesData: {
              companies: { id: string; name: string; slug: string }[];
            } = await response.json();

            let existingCompany: {
              id: string;
              name: string;
              slug: string;
            } | null = null;
            if (selectedCompanyId) {
              existingCompany =
                companiesData.companies.find(
                  (company) => company.id === selectedCompanyId
                ) || null;
            }

            set({
              companies: companiesData.companies,
              selectedCompany:
                companiesData.companies.length === 0
                  ? { id: "-1", name: "brak", slug: "-1" }
                  : existingCompany
                  ? existingCompany
                  : companiesData.companies[0],
            });
          }
        } catch (error) {
          throw new Error(
            "Nie udało się pobrać listy firm dla tego projektu, proszę spróbować później"
          );
        }
      },
    }),
    {
      name: "invoice_manager",
    }
  )
);
