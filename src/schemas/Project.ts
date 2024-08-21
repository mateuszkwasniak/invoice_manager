import { z } from "zod";

export const ProjectFormSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, { message: "Minimalna długość nazwy projektu to 1 znak." })
    .max(255, { message: "Maksymalna długość nazwy projektu to 255 znaków." }),
});

export type ProjectFormInput = z.infer<typeof ProjectFormSchema>;
