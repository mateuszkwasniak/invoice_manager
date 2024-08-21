import React from "react";
import { auth } from "../../auth";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import ProjectCompanyForm from "@/components/forms/ProjectCompanyForm";
import RecentCompanyCard from "@/components/cards/RecentCompanyCard";
import Link from "next/link";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import SelectProjectAndCompanyWithRedirectButton from "@/components/buttons/SelectCompanyAndProjectWithRedirectButton";
import { PlusCircle } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const [recentCompanies, recentPayments] = await Promise.all([
    prisma.company.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        payments: {
          take: 3,
          orderBy: {
            paymentDate: "desc",
          },
          select: {
            id: true,
            paid: true,
            title: true,
            slug: true,
            price: true,
            paymentDate: true,
          },
        },
      },
    }),
    prisma.payment.findMany({
      where: {
        userId,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        paid: true,
        title: true,
        slug: true,
        price: true,
        paymentDate: true,
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            project: {
              select: {
                id: true,
                slug: true,
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return (
    <main>
      <h1 className="text-3xl font-semibold text-center mb-4">
        Witaj, {session?.user?.name}!
      </h1>
      <section className="h-fit w-full lg:w-[70%] xl:max-w-[800px] flex flex-col items-center gap-4">
        <Separator className="mb-4 shadow-sm" />
        {recentCompanies.length ? (
          <>
            <h3 className="text-xl font-semibold text-muted-foreground ml-5 mr-auto">
              Ostatnie płatności:
            </h3>
            {recentPayments?.length && (
              <ul className="flex flex-col w-full md:w-[95%] mb-12">
                {recentPayments.map((payment) => (
                  <li
                    key={payment.id}
                    className="w-full flex items-center justify-between gap-4"
                  >
                    <Link
                      className="flex-1"
                      href={`payments/${payment.company.project.slug}/${payment.company.slug}/${payment.slug}`}
                    >
                      <div
                        className={`p-3 flex items-center justify-between w-full border-b ${
                          !payment.paid
                            ? "bg-red-50 hover:bg-red-100"
                            : "hover:bg-muted"
                        } transition duration-300`}
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold">
                            {payment.title}

                            <span className="text-sm text-muted-foreground block">
                              ({payment.company?.name})
                            </span>
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {payment.paymentDate.toLocaleDateString("PL")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {convertNumberToPrice(payment.price.toNumber())} zł
                          </p>
                        </div>
                      </div>
                    </Link>
                    <SelectProjectAndCompanyWithRedirectButton
                      variant="ghost"
                      size="icon"
                      href="payments/new"
                      projectId={payment.company.project.id}
                      companyId={payment.company.id}
                    >
                      <PlusCircle />
                    </SelectProjectAndCompanyWithRedirectButton>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="text-xl font-semibold text-muted-foreground ml-5 mr-auto">
              Najnowsze firmy i projekty:
            </h3>
            <Carousel className="w-3/4 md:w-full max-w-[800px]">
              <CarouselContent>
                {recentCompanies.map((company) => (
                  <CarouselItem key={company.id}>
                    <RecentCompanyCard company={company} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </>
        ) : (
          <>
            <h3 className="w-full text-center text-2xl font-semibold opacity-60">
              Stwórz projekt i firmę
            </h3>
            <p className="text-base text-center text-muted-foreground mb-6">
              Wprowadź nazwę projektu oraz pierwszej firmy w jego zakresie.
              Opcjonalnie możesz określić docelową wartość budżetu usług oraz
              materiałów
            </p>
            <ProjectCompanyForm />
          </>
        )}
      </section>
    </main>
  );
}
