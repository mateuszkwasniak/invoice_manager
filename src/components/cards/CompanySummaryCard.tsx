import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { $Enums } from "@prisma/client";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import { Separator } from "../ui/separator";

const paymentTypeLabels = {
  services: "usługi",
  materials: "materiały",
};

export default function CompanySummaryCard({
  company,
}: {
  company: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
    projectName: string;
    paymentsCount: number;
    paidCount: number;
    unpaidCount: number;
    totalPaid: { total: number } & Record<$Enums.PaymentType, number>;
    totalUnpaid: { total: number } & Record<$Enums.PaymentType, number>;
  };
}) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-4">
          Firma: {company.name} ({company.projectName})
        </CardTitle>
        <CardDescription>Podsumowanie płatności</CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground">
              Początek świadczenia usług:
            </span>
            <span className="font-semibold">
              {company.startDate.toLocaleDateString("pl")}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground">
              Koniec świadczenia usług:
            </span>
            <span className="font-semibold">
              {company?.endDate?.toLocaleDateString("pl") || "Nieokreślony"}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground">
              Całkowita liczba płatności:
            </span>
            <span className="font-semibold">{company.paymentsCount}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground opacity-65 ml-6">
              Liczba płatności rozliczonych:
            </span>
            <span className="font-semibold text-muted-foreground opacity-65 text-sm">
              {company.paidCount}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground opacity-65 ml-6">
              Liczba płatności nierozliczonych:
            </span>
            <span className="font-semibold text-muted-foreground opacity-65 text-sm">
              {company.unpaidCount}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground">
              Suma płatności rozliczonych:
            </span>
            <div className="flex flex-col gap-2">
              <span className="font-semibold self-end">
                {convertNumberToPrice(company.totalPaid.total)} zł
              </span>
            </div>
          </div>
          {Object.keys(paymentTypeLabels).map((label: string) => {
            if (company.totalPaid?.[label as $Enums.PaymentType]) {
              return (
                <div
                  className="w-full flex justify-between items-center"
                  key={label}
                >
                  <span className="font-semibold text-muted-foreground opacity-65 ml-6">
                    {paymentTypeLabels[label as keyof typeof paymentTypeLabels]}
                    :
                  </span>
                  <span className="font-semibold text-sm text-muted-foreground text-nowrap opacity-65 ml-6">
                    {convertNumberToPrice(
                      company.totalPaid?.[label as $Enums.PaymentType]
                    )}{" "}
                    zł
                  </span>
                </div>
              );
            }
          })}
          <div className="flex items-start justify-between">
            <span className="font-semibold text-muted-foreground">
              Suma płatności nierozliczonych:
            </span>
            <div className="flex flex-col gap-2">
              <span className="font-semibold self-end">
                {convertNumberToPrice(company.totalUnpaid.total)} zł
              </span>
            </div>
          </div>
          {Object.keys(paymentTypeLabels).map((label: string) => {
            if (company.totalUnpaid?.[label as $Enums.PaymentType]) {
              return (
                <div
                  className="w-full flex justify-between items-center"
                  key={label}
                >
                  <span className="font-semibold text-muted-foreground opacity-65 ml-6">
                    {paymentTypeLabels[label as keyof typeof paymentTypeLabels]}
                    :
                  </span>
                  <span className="font-semibold text-sm text-muted-foreground text-nowrap opacity-65 ml-6">
                    {convertNumberToPrice(
                      company.totalUnpaid?.[label as $Enums.PaymentType]
                    )}{" "}
                    zł
                  </span>
                </div>
              );
            }
          })}
        </div>
      </CardContent>
    </Card>
  );
}
