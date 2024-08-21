import { $Enums } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const prepareBudgetsPieChartData = (
  budgets: {
    id: string;
    type: $Enums.PaymentType;
    value: Decimal;
  }[],
  payments: {
    id: string;
    paymentDate: Date;
    type: $Enums.PaymentType;
    title: string;
    paid: boolean;
    price: Decimal;
  }[]
): {
  budgetValue: number;
  paid: number;
  type: $Enums.PaymentType;
  chartData: {
    type: "paid" | "left";
    state: number;
    fill: string;
  }[];
}[] => {
  if (!budgets.length) [];
  let budgetsChartData: {
    budgetValue: number;
    paid: number;
    type: $Enums.PaymentType;
    chartData: {
      type: "paid" | "left";
      state: number;
      fill: string;
    }[];
  }[] = [];

  budgets.forEach((budget) => {
    const totalPaymentsValue = payments.reduce((acc: Decimal, payment) => {
      if (payment.paid && payment.type === budget.type) {
        return acc.plus(payment.price).toDecimalPlaces(2);
      } else return acc;
    }, new Decimal(0));

    const finishPrc = totalPaymentsValue
      .dividedBy(budget.value)
      .times(100)
      .toDecimalPlaces(0)
      .toNumber();

    budgetsChartData.push({
      budgetValue: Number(budget.value.toFixed(2)),
      paid: totalPaymentsValue.toNumber(),
      type: budget.type,
      chartData: [
        {
          type: "paid",
          state: finishPrc,
          fill: finishPrc < 100 ? "hsl(var(--chart-2))" : "hsl(var(--chart-4))",
        },
        {
          type: "left",
          state: finishPrc >= 100 ? 0 : Number((100 - finishPrc).toFixed(0)),
          fill: "#caceccf1",
        },
      ],
    });
  });

  return budgetsChartData;
};

const initTotal = Object.fromEntries(
  Object.values($Enums.PaymentType).map((value) => [value, new Decimal(0)])
) as Record<$Enums.PaymentType, Decimal>;

export const prepareMonthBarChartData = (
  payments: {
    id: string;
    paymentDate: Date;
    type: $Enums.PaymentType;
    price: Decimal;
    paid: boolean;
  }[]
): {
  total: Record<$Enums.PaymentType, number>;
  chartData: ({
    date: string;
  } & Record<$Enums.PaymentType, number>)[];
} => {
  let total = { ...initTotal };
  let paymentsObj: {
    [key: string]: {
      date: string;
    } & Record<$Enums.PaymentType, number>;
  } = {};

  payments.forEach((payment) => {
    total[payment.type] = total[payment.type]
      .plus(payment.price)
      .toDecimalPlaces(2);

    const dateIndex = payment.paymentDate
      .toLocaleDateString("pl", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
      .split(".")
      .reverse()
      .join("-");

    paymentsObj[dateIndex] = {
      ...paymentsObj[dateIndex],
      date: dateIndex,
      [payment.type]: new Decimal(payment.price)
        .plus(
          paymentsObj[dateIndex]?.[payment.type] ||
            new Decimal(0).toDecimalPlaces(2).toNumber()
        )
        .toNumber()
        .toFixed(2),
    };
  });

  const convertedTotalToNumber: Record<$Enums.PaymentType, number> =
    Object.fromEntries(
      Object.values($Enums.PaymentType).map((value) => [value, 0.0])
    ) as Record<$Enums.PaymentType, number>;

  for (const prop in total) {
    convertedTotalToNumber[prop as keyof typeof convertedTotalToNumber] =
      total[prop as keyof typeof total].toNumber();
  }

  return {
    total: convertedTotalToNumber,
    chartData: Object.values(paymentsObj),
  };
};

export const prepareCompanySummary = (company: {
  id: string;
  project: {
    id: string;
    name: string;
  };
  name: string;
  startDate: Date;
  endDate: Date | null;

  budgets: {
    id: string;
    value: Decimal;
    type: $Enums.PaymentType;
  }[];
  payments: {
    id: string;
    slug: string;
    paymentDate: Date;
    title: string;
    price: Decimal;
    paid: boolean;
    type: $Enums.PaymentType;
  }[];
}) => {
  const paymentsCount = company.payments.length;
  let totalPaidAll: Decimal = new Decimal(0);
  let totalUnpaidAll: Decimal = new Decimal(0);
  let totalPaidInTypes = { ...initTotal };
  let totalUnpaidInTypes = { ...initTotal };
  let paidCount: number = 0;
  let unpaidCount: number = 0;

  company.payments.forEach((payment) => {
    if (payment.paid) {
      paidCount += 1;
      totalPaidAll = totalPaidAll.plus(payment.price).toDecimalPlaces(2);
      totalPaidInTypes[payment.type] = totalPaidInTypes[payment.type]
        .plus(payment.price)
        .toDecimalPlaces(2);
    } else {
      unpaidCount += 1;
      totalUnpaidAll = totalUnpaidAll.plus(payment.price).toDecimalPlaces(2);
      totalUnpaidInTypes[payment.type] = totalUnpaidInTypes[payment.type]
        .plus(payment.price)
        .toDecimalPlaces(2);
    }
  });

  let convertedTotalPaidInTypesToNumber: Record<$Enums.PaymentType, number> =
    Object.fromEntries(
      Object.values($Enums.PaymentType).map((value) => [value, 0])
    ) as Record<$Enums.PaymentType, number>;

  let convertedTotalUnpaidInTypesToNumber: Record<$Enums.PaymentType, number> =
    Object.fromEntries(
      Object.values($Enums.PaymentType).map((value) => [value, 0])
    ) as Record<$Enums.PaymentType, number>;

  for (const prop in totalPaidInTypes) {
    convertedTotalPaidInTypesToNumber[
      prop as keyof typeof convertedTotalPaidInTypesToNumber
    ] = totalPaidInTypes[prop as keyof typeof totalPaidInTypes].toNumber();
  }

  for (const prop in totalUnpaidInTypes) {
    convertedTotalUnpaidInTypesToNumber[
      prop as keyof typeof convertedTotalUnpaidInTypesToNumber
    ] = totalUnpaidInTypes[prop as keyof typeof totalUnpaidInTypes].toNumber();
  }

  return {
    id: company.id,
    name: company.name,
    startDate: company.startDate,
    endDate: company?.endDate,
    projectName: company.project.name,

    paymentsCount,
    paidCount,
    unpaidCount,
    totalPaid: {
      total: totalPaidAll.toNumber(),
      ...convertedTotalPaidInTypesToNumber,
    },
    totalUnpaid: {
      total: totalUnpaidAll.toNumber(),
      ...convertedTotalUnpaidInTypesToNumber,
    },
  };
};
