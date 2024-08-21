"use client";

import React from "react";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { $Enums } from "@prisma/client";
import { convertNumberToPrice } from "@/lib/utils/numbers";

const chartConfig = {
  price: {
    label: "Zapłacono",
  },
  materials: {
    label: "Materiały",
    color: "#7d20c9",
  },
  services: {
    label: "Usługi",
    color: "#63c1db",
  },
} satisfies ChartConfig;

export default function MonthPaymentsBarChart({
  total,
  chartData,
}: {
  total: Record<$Enums.PaymentType, number>;
  chartData: ({
    date: string;
  } & Record<$Enums.PaymentType, number>)[];
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("services");

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Ostatni miesiąc</CardTitle>
          <CardDescription>
            Podusmowanie zrealizowanych płatności z ostatnich 30 dni
          </CardDescription>
        </div>
        <div className="flex">
          {["materials", "services"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="!text-lg whitespace-nowrap font-bold leading-none sm:text-3xl">
                  {convertNumberToPrice(total[key as keyof typeof total])} zł
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-12">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[360px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pl", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  currencyPL={true}
                  nameKey="price"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pl", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              maxBarSize={50}
              fill={`var(--color-${activeChart})`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
