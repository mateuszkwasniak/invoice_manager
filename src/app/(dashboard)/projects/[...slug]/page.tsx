import { redirect } from "next/navigation";
import React from "react";
import { auth } from "../../../../auth";
import prisma from "@/lib/db";
import CompanyDisplayAndEditForm from "@/components/forms/CompanyDisplayAndEditForm";

export default async function ProjectCompanyPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/sign-in");
  }
  const userId = session.user.id;

  const [projectParam, companyParam] = [...params.slug];
  if (!companyParam || !projectParam || params.slug?.length > 2) {
    return redirect("/");
  }

  const company = (
    await prisma.company.findMany({
      where: {
        userId,
        slug: companyParam,
        project: {
          slug: projectParam,
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        startDate: true,
        endDate: true,
        details: true,
        files: true,
        slug: true,

        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        budgets: {
          select: {
            id: true,
            value: true,
            type: true,
          },
        },
      },
      take: 1,
    })
  )[0];

  let content: React.ReactNode;

  if (!company) {
    content = (
      <h1 className="text-3xl font-semibold text-center">
        Wybrana firma lub projekt nie istnieją lub nie zostały dodane przez
        Ciebie
      </h1>
    );
  } else
    content = (
      <>
        <h1 className="text-3xl font-semibold mb-8 text-center">
          Szczegóły firmy
        </h1>
        <CompanyDisplayAndEditForm
          company={{
            ...company,
            budgets: company.budgets.map((budget) => ({
              ...budget,
              value: budget.value.toNumber(),
            })),
          }}
        />
      </>
    );

  return (
    <main>
      <section className="w-full 2xl:w-[50%]">{content}</section>
    </main>
  );
}
