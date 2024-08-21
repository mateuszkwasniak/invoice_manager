import { z } from "zod";
import { ProjectFormSchema } from "./Project";
import { BudgetFormSchema } from "./Budget";
import { $Enums } from "@prisma/client";

export const CompanyFormSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, { message: "Minimalna długośc nazwy firmy to 1 znak." })
    .max(255, { message: "Maksymalna długość nazwy firmy to 255 znaków." }),
  startDate: z.date({
    required_error: "Proszę podać rozpoczęcia współpracy z firmą.",
  }),
  endDate: z.date().nullable().optional(),
  details: z
    .string()
    .max(5000, "Maksymalna długość notatek to 5000 znaków.")

    .optional(),
});

export const CompanyBudgetFormSchema = CompanyFormSchema.extend({
  budgets: z.array(BudgetFormSchema),
});

export type CompanyBudgetFormInput = z.infer<typeof CompanyBudgetFormSchema>;

export const ProjectCompanyFormSchema =
  CompanyBudgetFormSchema.merge(ProjectFormSchema);

export type CompanyFormInput = z.infer<typeof CompanyFormSchema>;
export type ProjectCompanyFormInput = z.infer<typeof ProjectCompanyFormSchema>;

export const CompanyUpdateFormSchema = CompanyFormSchema.extend({
  id: z.string().min(1).max(30),
  files: z.string().min(1).max(255).array(),
  budgets: z.array(BudgetFormSchema),
});

export type CompanyUpdateFormInput = z.infer<typeof CompanyUpdateFormSchema>;

export type CompanyDisplayAndEditFormData = {
  id: string;
  name: string;
  createdAt: Date;
  startDate: Date;
  endDate?: Date | null;
  details?: string | null;
  files: string[];
  slug: string;
  project: {
    id: string;
    name: string;
    slug: string;
  };
  budgets: {
    id: string;
    type: $Enums.PaymentType;
    value: number;
  }[];
};
