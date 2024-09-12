import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CustomPagination from "../../pagination/CustomPagination";
import Link from "next/link";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import ClientCheckboxMain from "./ClientCheckboxMain";
import ClientCheckbox from "./ClientCheckbox";
import CheckboxContextProvider from "@/context/CheckboxContext";
import ClientLink from "../../navigation/ClientLink";
import PaymentSearch from "@/components/forms/PaymentSearch";
import Filter from "./Filter";
import { PaymentsTableRowData } from "@/schemas/Payment";
import { Plus } from "lucide-react";

const paymentTypes = {
  Materiały: "materials",
  Usługi: "services",
};

export default function PaymentsTable({
  payments,
  page,
  pageCount,
  searchParams,
}: {
  payments: PaymentsTableRowData[];
  page: number;
  pageCount: number;
  searchParams: { [key: string]: any };
}) {
  const paymentIds = payments.map((payment) => payment.id);
  return (
    <CheckboxContextProvider>
      <section className="w-full h-full flex flex-col items-center justify-center gap-8">
        <div className="w-full flex flex-col sm:flex-row items-center gap-8">
          <div className="w-full sm:w-3/4 lg:w-1/3">
            <PaymentSearch />
          </div>
          <div className="flex justify-start items-center gap-4 w-full">
            <Filter
              paramName="paid"
              placeholder="Filtruj stan"
              label="Stan płatności"
              items={{
                Opłacone: "true",
                Nieopłacone: "false",
              }}
            />
            <Filter
              paramName="type"
              placeholder="Filtruj typ"
              label="Typ płatności"
              items={paymentTypes}
            />
            <Link
              href="payments/new"
              className="ml-auto h-10 flex items-center gap-1 rounded px-3 text-secondary text-sm font-semibold bg-primary hover:opacity-85 dark:bg-zinc-300 hover:dark:bg-zinc-200 transition duration-300"
            >
              <Plus className="w-4 h-4" />
              Nowa
            </Link>
          </div>
        </div>
        <div className="w-full flex gap-">
          <Table className="w-full dark:bg-card rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="flex items-center gap-4">
                  <ClientCheckboxMain data={paymentIds} />
                  Tytuł
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Kwota</TableHead>
                <TableHead className="text-right w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <Link
                  key={payment.id}
                  legacyBehavior
                  passHref
                  target="_blank"
                  href={`/payments/${payment.company.project.slug}/${payment.company.slug}/${payment.slug}`}
                >
                  <TableRow
                    data-testid="payment-row"
                    className={`cursor-pointer ${
                      !payment.paid &&
                      "bg-red-50 dark:bg-red-900 hover:bg-red-100 hover:dark:bg-red-800"
                    }`}
                  >
                    <TableCell className="font-medium flex items-center gap-4">
                      <ClientCheckbox itemId={payment.id} />
                      {payment.title}
                    </TableCell>
                    <TableCell>
                      {payment.paid ? "Opłacona" : "Nieopłacona"}
                    </TableCell>
                    <TableCell>
                      {payment.type === "materials" ? "Materiały" : "Usługi"}
                    </TableCell>
                    <TableCell>
                      {payment.paymentDate.toLocaleDateString("PL")}
                    </TableCell>
                    <TableCell className="text-right">
                      {convertNumberToPrice(payment.price.toNumber())} zł
                    </TableCell>
                    <TableCell>
                      <ClientLink
                        href={`/payments/${payment.company.project.slug}/${payment.company.slug}/${payment.slug}`}
                      />
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
            </TableBody>
          </Table>
        </div>
        <CustomPagination
          page={page}
          pageCount={pageCount}
          searchParams={searchParams}
        />
      </section>
    </CheckboxContextProvider>
  );
}
