"use client";
import React from "react";
import { Label, Pie, PieChart } from "recharts";

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

const chartConfig = {
  paid: {
    label: "Opłacono",
  },
  left: {
    label: "Pozostało",
  },
} satisfies ChartConfig;

export default function BudgetPieChart({
  budgetValue,
  paid,
  type,
  chartData,
}: {
  budgetValue: number;
  paid: number;
  type: string;
  chartData: {
    type: "paid" | "left";
    state: number;
    fill: string;
  }[];
}) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="items-center border-b">
        <CardTitle className="w-full text-nowrap">
          Budżet {type === "services" ? "usług" : "materiałów"} -{" "}
          {convertNumberToPrice(budgetValue)} zł
        </CardTitle>
        <CardDescription className="w-full">
          Realizacja założonego budżetu w zakresie{" "}
          {type === "services" ? "usług" : "materiałów"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <span className="mt-4 mb-1 text-sm font-semibold block text-center">
          {convertNumberToPrice(paid)} zł z {convertNumberToPrice(budgetValue)}{" "}
          zł
        </span>
        <span className="text-sm text-center block text-muted-foreground font-semibold">
          (pozostało: {convertNumberToPrice(budgetValue - paid)} zł)
        </span>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel percentage />}
            />
            <Pie
              data={chartData}
              dataKey="state"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {
                            chartData.find((data) => data.type === "paid")
                              ?.state
                          }
                          %
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {type === "services" ? "Usługi" : "Materiały"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
