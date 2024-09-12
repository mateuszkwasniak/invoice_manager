import NotPaidCard from "@/components/cards/NotPaidCard";
import CompanySummaryCard from "@/components/cards/CompanySummaryCard";
import BudgetPieChart from "@/components/charts/BudgetPieChart";
import MonthPaymentsBarChart from "@/components/charts/MonthPaymentsBarChart";
import CompanyIdController from "@/components/controllers/CompanyIdController";
import {
  prepareBudgetsPieChartData,
  prepareCompanySummary,
  prepareMonthBarChartData,
} from "@/lib/utils/charts";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "../../../auth";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import ProjectSummaryCard from "@/components/cards/ProjectSummaryCard";
import ProjectCompaniesPieChart from "@/components/charts/ProjectCompaniesPieChart";

export default async function SummaryPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/sign-in");
  }
  const userId = session.user.id;

  const companyIdParam = searchParams?.cid?.toString();
  const projectIdParam = searchParams?.pid?.toString();

  if (!companyIdParam && !projectIdParam) {
    return redirect("/");
  }

  let content: React.ReactNode;

  if (companyIdParam) {
    const company = await prisma.company.findUnique({
      where: {
        userId,
        id: companyIdParam,
      },
      select: {
        id: true,
        slug: true,
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        name: true,
        startDate: true,
        endDate: true,
        budgets: {
          where: {
            value: {
              gt: 0,
            },
          },
          select: {
            id: true,
            value: true,
            type: true,
          },
        },
        payments: {
          select: {
            id: true,
            slug: true,
            paymentDate: true,
            title: true,
            price: true,
            paid: true,
            type: true,
          },
          orderBy: {
            paymentDate: "asc",
          },
        },
      },
    });

    let budgetPieCharts: React.ReactNode[] = [];

    if (company) {
      let dateBefore30Days = new Date();
      dateBefore30Days.setDate(dateBefore30Days.getDate() - 30);

      const paymentsIn30Days = company.payments.filter(
        (payment) => payment.paymentDate > dateBefore30Days && payment.paid
      );

      let monthPaymentsChartData: ReturnType<
        typeof prepareMonthBarChartData
      > | null = null;

      if (paymentsIn30Days.length) {
        monthPaymentsChartData = prepareMonthBarChartData(paymentsIn30Days);
      }
      const budgetsChartData = prepareBudgetsPieChartData(
        company.budgets,
        company.payments
      );
      const companySummary = prepareCompanySummary(company);

      if (budgetsChartData.length) {
        budgetsChartData.forEach((data) =>
          budgetPieCharts.push(
            <BudgetPieChart
              type={data.type}
              chartData={data.chartData}
              budgetValue={data.budgetValue}
              paid={data.paid}
            />
          )
        );
      }

      content = (
        <section className="w-full sm:w-fit sm:min-w-[50%] flex flex-col gap-8">
          <div className="w-full">
            <CompanySummaryCard company={companySummary} />
          </div>
          <div className="w-full flex items-center gap-8 flex-wrap">
            {budgetPieCharts.map((chart, idx) => (
              <div
                key={idx}
                className={`${
                  budgetPieCharts?.length === 1 ? "w-full" : "flex-0.5"
                }`}
              >
                {chart}
              </div>
            ))}
          </div>
          {monthPaymentsChartData ? (
            <div className="h-full">
              <MonthPaymentsBarChart {...monthPaymentsChartData} />
            </div>
          ) : null}

          <div className="">
            <NotPaidCard
              project={company.project.slug}
              company={company.slug}
              payments={company.payments.filter((payment) => !payment.paid)}
            />
          </div>
        </section>
      );
    } else {
      content = (
        <h1 className="text-3xlfont-semibold">
          Wybrana firma nie istnieje lub nie należy do Ciebie
        </h1>
      );
    }
  } else {
    const project = await prisma.project.findUnique({
      where: {
        userId,
        id: projectIdParam,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        companies: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (project) {
      let projectCompanyPaymentsSummary:
        | (Prisma.PickEnumerable<
            Prisma.PaymentGroupByOutputType,
            "companyId"[]
          > & {
            _sum: {
              price: Decimal | null;
            };
          })[]
        | null = null;

      if (project.companies.length) {
        projectCompanyPaymentsSummary = await prisma.payment.groupBy({
          by: "companyId",
          where: {
            userId,
            companyId: {
              in: project.companies.map((company) => company.id),
            },
            paid: true,
          },
          _sum: {
            price: true,
          },
          orderBy: {
            _sum: {
              price: "desc",
            },
          },
        });
      }

      let pieChartPaymentsData:
        | {
            id: string;
            _sum: number;
          }[]
        | null = null;

      if (projectCompanyPaymentsSummary?.length) {
        const projectCompanyPaymentsSummaryWithNumbers =
          projectCompanyPaymentsSummary?.map((item) => ({
            id: item.companyId,
            _sum: item._sum.price?.toNumber() || 0,
          }));

        const pieChartDataHighestSums =
          projectCompanyPaymentsSummaryWithNumbers?.slice(0, 5);
        const pieChartDataRestSum = projectCompanyPaymentsSummaryWithNumbers
          ?.slice(5)
          .reduce((acc, item) => acc + item._sum, 0);

        pieChartPaymentsData = pieChartDataRestSum
          ? [
              ...pieChartDataHighestSums,
              { id: "-1", _sum: pieChartDataRestSum },
            ]
          : pieChartDataHighestSums;
      }

      content = (
        <section className="w-full sm:w-fit sm:min-w-[50%] flex flex-col gap-8">
          <div className="w-full">
            <ProjectSummaryCard project={project} />
          </div>
          {pieChartPaymentsData?.length ? (
            <div className="w-full">
              <ProjectCompaniesPieChart
                companies={project.companies}
                payments={pieChartPaymentsData}
              />
            </div>
          ) : (
            <h2 className="ml-6 text-muted-foreground">
              Brak płatności w ramach projektu
            </h2>
          )}
        </section>
      );
    } else {
      content = (
        <h1 className="text-3xl font-semibold">
          Wybrany projekt nie istnieje lub nie należy do Ciebie
        </h1>
      );
    }
  }

  return (
    <main>
      {content}
      <CompanyIdController />
    </main>
  );
}
