import type { $Enums } from "@prisma/client";

export const budgetTypes: { type: $Enums.PaymentType; label: string }[] = [
  { type: "services", label: "Usług" },
  {
    type: "materials",
    label: "Materiałów",
  },
];
