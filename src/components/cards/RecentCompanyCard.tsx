import React from "react";
import { Card } from "@/components/ui/card";
import { NotepadText, CircleDollarSign, Plus } from "lucide-react";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/library";
import { Separator } from "../ui/separator";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import SelectCompanyAndProjectWithRedirectButton from "../buttons/SelectCompanyAndProjectWithRedirectButton";
export default function RecentProjectCard({
  company,
}: {
  company: {
    id: string;
    name: string;
    slug: string;
    project: {
      id: string;
      name: string;
      slug: string;
    };
    payments: {
      id: string;
      title: string;
      slug: string;
      price: Decimal;
      paid: boolean;
      paymentDate: Date;
    }[];
  };
}) {
  return (
    <Card className="w-[95%] h-fit max-h-[99%] flex flex-col p-6 mx-auto">
      <div className="flex flex-col sm:flex-row sm: gap-4 justify-between">
        <Link
          href={`projects/${company.project.slug}/${company.slug}`}
          className="transition duration-300 hover:bg-secondary py-2 pr-8 mb-2 rounded-md"
        >
          <div className="flex items-center gap-2">
            <div>
              <NotepadText className="w-20 h-20 text-muted-foreground" />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <span className="w-fit p-1 px-2 bg-primary dark:bg-zinc-200 text-secondary text-xs font-semibold uppercase text-center rounded-md">
                {company.project.name}
              </span>
              <p className="text-2xl font-semibold">{company.name}</p>
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-2 justify-center">
          <SelectCompanyAndProjectWithRedirectButton
            companyId={company.id}
            projectId={company.project.id}
            href={`/payments/new`}
            variant={"default"}
            className="dark:bg-zinc-300 hover:dark:bg-zinc-200"
          >
            <Plus className="w-6 h-6 mr-1.5" />
            Nowa płatność
          </SelectCompanyAndProjectWithRedirectButton>
          <SelectCompanyAndProjectWithRedirectButton
            companyId={company.id}
            projectId={company.project.id}
            href={`/payments?cid=${company.id}`}
            variant={"outline"}
            className="dark:bg-zinc-700 dark:hover:bg-zinc-900"
          >
            Historia płatności
          </SelectCompanyAndProjectWithRedirectButton>
        </div>
      </div>
      <Separator className="my-4 w-full sm:w-1/2" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="flex items-end gap-1 text-base sm:text-xl text-muted-foreground font-semibold">
            <CircleDollarSign className="w-8 h-8 text-muted-foreground opacity-65" />
            Ostatnie płatności:
          </p>
        </div>
        {company.payments.length ? (
          <ul className="flex flex-col">
            {company.payments.map((payment) => (
              <li key={payment.id}>
                <Link
                  href={`payments/${company.project.slug}/${company.slug}/${payment.slug}`}
                >
                  <div
                    className={`p-3 flex items-center justify-between w-full border-b ${
                      !payment.paid
                        ? "bg-red-50 hover:bg-red-100"
                        : "hover:bg-muted"
                    } transition duration-300`}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-xs md:text-base">
                        {payment.title}
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm font-semibold opacity-65">
            Brak płatności
          </p>
        )}
      </div>
    </Card>
  );
}
