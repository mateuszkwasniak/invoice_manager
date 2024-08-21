import { convertNumberToPrice } from "@/lib/utils/numbers";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import type { Decimal } from "@prisma/client/runtime/library";

export const PaymentFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Nazwa płatności powinna składać się z przynajmniej 2 znaków.",
    })
    .max(255, {
      message: "Nazwa płatności nie może być dłuższa niż 255 znaków.",
    }),
  type: z.enum(["materials", "services"], {
    message: 'Typ płatności to "materiały" lub "usługi".',
  }),
  paymentDate: z.date({ required_error: "Proszę podać datę płatności." }),
  details: z
    .string()
    .max(5000, "Maksymalna długość notatek to 5000 znaków.")
    .optional(),
  paid: z.boolean(),
  price: z
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
  companyId: z.string().min(1).max(255),
  projectId: z.string().min(1).max(255),
});

export const PaymentUpdateFormSchema = PaymentFormSchema.extend({
  id: z.string().min(1).max(30),
  files: z.string().min(1).max(255).array(),
});

export type PaymentFormInput = z.infer<typeof PaymentFormSchema>;
export type PaymentUpdateFormInput = z.infer<typeof PaymentUpdateFormSchema>;

export type PaymentDisplayAndEditFormData = {
  id: string;
  paymentDate: Date;
  title: string;
  slug: string;
  type: $Enums.PaymentType;
  details: string | null;
  files: string[];
  paid: boolean;
  price: string;
  userId: string;
  company: {
    id: string;
    name: string;
    slug: string;
    project: {
      id: string;
      name: string;
      slug: string;
    };
  };
};

export type PaymentsTableRowData = {
  id: string;
  title: string;
  paymentDate: Date;
  slug: string;
  type: $Enums.PaymentType;
  paid: boolean;
  price: Decimal;
  company: { slug: string; project: { slug: string } };
};
