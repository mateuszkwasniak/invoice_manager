"use client";

import React from "react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertNumberToPrice } from "@/lib/utils/numbers";

export default function ProjectCompaniesPieChart({
  companies,
  payments,
}: {
  companies: { id: string; name: string; slug: string }[];
  payments: { id: string; _sum: number }[];
}) {
  const chartConfig = Object.fromEntries(
    companies.map((company, idx) => [
      company.id,
      {
        label: company.name,
        color: `hsl(var(--chart-${idx + 1}))`,
      },
    ])
  ) satisfies ChartConfig;

  const chartData = companies.map((company) => ({
    company: company.id,
    sum: payments.find((payment) => payment.id === company.id)?._sum || 0,
    fill: `var(--color-${company.id})`,
  }));

  let restSumItem = payments.find((item) => item.id === "-1");

  if (restSumItem) {
    chartConfig[restSumItem.id] = {
      label: "Pozostałe",
      color: `hsl(var(--muted-foreground))`,
    };

    chartData.push({
      company: restSumItem.id,
      sum: restSumItem._sum,
      fill: `var(--color-${restSumItem.id})`,
    });
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="items-center border-b">
        <CardTitle className="w-full text-nowrap">
          Całkowity, aktualny koszt projektu
        </CardTitle>
        <CardDescription className="w-full">
          Sumy dokonanych płatności w firmach realizujących projekt
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <h3 className="text-3xl text-center font-semibold pt-4">
          {convertNumberToPrice(
            payments.reduce((acc, payment) => acc + payment._sum, 0)
          ) + " zł"}
        </h3>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent currencyPL />}
            />
            <Pie
              data={chartData}
              dataKey="sum"
              nameKey="company"
              innerRadius={60}
              strokeWidth={5}
            ></Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
