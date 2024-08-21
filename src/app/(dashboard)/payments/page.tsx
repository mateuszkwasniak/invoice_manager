import PaymentsTable from "@/components/tables/payments-table/PaymentsTable";
import prisma from "@/lib/db";
import React from "react";
import { redirect } from "next/navigation";

import CompanyIdController from "@/components/controllers/CompanyIdController";
import { auth } from "../../../auth";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/sign-in");
  }
  const userId = session.user.id;

  if (!searchParams) {
    return redirect("/");
  }

  let pageNum = 1;
  const { page, cid, query, ...rest } = searchParams;

  if (!cid) {
    return redirect("/");
  }
  if (page && typeof Number(page) === "number" && Number(page) > 1) {
    pageNum = Number(page);
  }

  let content: React.ReactNode;

  if (cid === "-1") {
    content = (
      <h1 className="text-3xl  font-semibold">
        Aby przeglądać płatności dodaj firmę w obrębie wybranego projektu
      </h1>
    );
  } else {
    let companyAndProjectNames: {
      name: string;
      project: {
        name: string;
      };
    } | null = null;
    let search: {
      [key: string]: any;
    } = {
      userId,
      companyId: cid.toString(),
    };

    if (query) {
      search.title = {
        contains: query.toString(),
        mode: "insensitive",
      };
    }

    if (rest) {
      if (rest.paid) {
        search.paid = rest.paid === "true" ? true : false;
      }
      if (rest?.type) {
        search.type = rest.type;
      }
    }

    const [payments, paymentsCount] = await Promise.all([
      prisma.payment.findMany({
        where: search,
        select: {
          id: true,
          slug: true,
          title: true,
          paid: true,
          price: true,
          paymentDate: true,
          type: true,
          company: {
            select: {
              name: true,
              slug: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        skip: (pageNum - 1) * 10,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      }),

      await prisma.payment.count({
        where: search,
      }),
    ]);

    if (!payments.length) {
      companyAndProjectNames = await prisma.company.findUnique({
        where: {
          id: cid.toString(),
        },
        select: {
          name: true,
          project: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      companyAndProjectNames = {
        name: payments[0].company.name,
        project: {
          name: payments[0].company.project.name,
        },
      };
    }

    const pageCount = Math.ceil(paymentsCount / 10);

    if (
      !payments?.length &&
      pageNum === 1 &&
      !query &&
      !Object.keys(rest)?.length
    ) {
      content = (
        <h1 className="text-3xl  font-semibold">Brak nowych płatności</h1>
      );
    } else if (!payments.length && pageNum > 1) {
      content = (
        <h1 className="text-3xl  font-semibold">
          Brak danych do wyświetlenia na stronie: {page}
        </h1>
      );
    } else {
      const { page, ...searchParamsWithoutPage } = searchParams;
      content = (
        <>
          <h1 className="text-3xl text-center font-semibold mb-12">
            Wykaz płatności dla {companyAndProjectNames?.name || ""} w projekcie{" "}
            {companyAndProjectNames?.project.name || ""}
          </h1>

          <PaymentsTable
            payments={payments}
            page={pageNum}
            pageCount={pageCount}
            searchParams={searchParamsWithoutPage}
          />
        </>
      );
    }
  }

  return (
    <main>
      <section className="w-full 2xl:w-3/4 flex gap-2 flex-col items-center">
        {content}
      </section>
      <CompanyIdController />
    </main>
  );
}
