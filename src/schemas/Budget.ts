import { z } from "zod";
import { convertNumberToPrice } from "@/lib/utils/numbers";

export const BudgetFormSchema = z.object({
  type: z.enum(["materials", "services"], {
    message: 'Typ budżetu to "materiały" lub "usługi".',
  }),
  value: z
    .string()
    .transform((val, ctx) => {
      const transformed = val.replaceAll(",", ".").replace(/\s/g, "").trim();
      const parsed = Number(transformed);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Proszę podać prawidłową kwotę.",
        });
        return;
      }

      return parsed;
    })
    .pipe(
      z
        .number()
        .min(0, "Kwota mniejsza niż 0 zł nie jest dozwolona.")
        .max(99999999.99, "Maksymalna kwota to 99999999.99 zł.")
    )
    .transform((val) => {
      return convertNumberToPrice(val);
    }),
});

export type BudgetFormInput = z.infer<typeof BudgetFormSchema>;
