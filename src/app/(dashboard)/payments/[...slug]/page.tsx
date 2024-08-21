import prisma from "@/lib/db";
import React from "react";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import PaymentDisplayAndEditForm from "@/components/forms/PaymentDisplayAndEditForm";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

export default async function SinglePaymentPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/sign-in");
  }
  const userId = session.user.id;

  const [projectParam, companyParam, paymentParam] = [...params.slug];
  if (
    !companyParam ||
    !projectParam ||
    !paymentParam ||
    params.slug?.length > 3
  ) {
    return redirect("/");
  }

  const payments = await prisma.payment.findMany({
    where: {
      userId,
      slug: params.slug[2],
      company: {
        slug: params.slug[1],
        project: {
          slug: params.slug[0],
        },
      },
    },
    select: {
      id: true,
      paymentDate: true,
      title: true,
      slug: true,
      type: true,
      details: true,
      files: true,
      paid: true,
      price: true,
      userId: true,
      company: {
        select: {
          id: true,
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
    take: 1,
  });

  const payment = payments[0];

  let content: React.ReactNode;

  if (!payment) {
    content = (
      <h1 className="text-3xl font-semibold">
        Płatność nie istnieje lub nie została dodana przez Ciebie
      </h1>
    );
  } else {
    content = (
      <>
        <h1 className="text-3xl font-semibold text-center mb-8">
          Szczegóły płatności
        </h1>
        <PaymentDisplayAndEditForm
          payment={{
            ...payment,
            price: convertNumberToPrice(payment.price.toNumber()),
          }}
        />
      </>
    );
  }

  return (
    <main>
      <section className="w-full 2xl:w-[75%]">{content}</section>
    </main>
  );
}
