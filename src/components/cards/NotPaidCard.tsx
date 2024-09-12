import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TriangleAlert, CircleCheckBig } from "lucide-react";
import { Decimal } from "@prisma/client/runtime/library";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { convertNumberToPrice } from "@/lib/utils/numbers";

export default function NotPaidCard({
  project,
  company,
  payments,
}: {
  project: string;
  company: string;
  payments: {
    id: string;
    slug: string;
    title: string;
    price: Decimal;
  }[];
}) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-4">
          {payments.length ? (
            <TriangleAlert className="w-6 h-6 text-red-600" />
          ) : (
            <CircleCheckBig className="w-6 h-6 text-green-700" />
          )}
          Płatności nierozliczone
        </CardTitle>
        <CardDescription>
          Lista płatności oznaczonych jako nierozliczone
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length ? (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 border-none">
            {payments.map((payment) => (
              <>
                <Link
                  key={payment.id}
                  href={`/payments/${project}/${company}/${payment.slug}`}
                  className="p-4 hover:bg-muted/50 text-sm flex items-center justify-between gap-8"
                >
                  <span className="font-semibold">{payment.title}</span>{" "}
                  <span>
                    {convertNumberToPrice(
                      payment.price.toDecimalPlaces(2).toNumber()
                    )}{" "}
                    zł
                  </span>
                </Link>
                <Separator />
              </>
            ))}
          </ScrollArea>
        ) : (
          <p className="w-full p-8 text-base font-semibold text-muted-foreground text-center">
            Wszystkie płatności dotyczące tego projektu są rozliczone.
            Gratulacje!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
