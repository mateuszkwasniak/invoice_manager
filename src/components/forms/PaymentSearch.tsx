"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function PaymentSearch() {
  const [searched, setSearched] = useState<string>("");

  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const queryParam = params?.get("query");

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (
      (queryParam && queryParam !== searched) ||
      (!queryParam && searched !== "")
    ) {
      const paramsObj = Object.fromEntries(params?.entries());
      if (searched !== "") {
        paramsObj.query = searched;
      } else {
        delete paramsObj.query;
      }
      delete paramsObj?.page;

      timeout = setTimeout(() => {
        router.replace(
          pathname + `?${new URLSearchParams(paramsObj).toString()}`
        );
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searched, params, queryParam, pathname]);

  useEffect(() => {
    if (!searched && queryParam) {
      setSearched(queryParam);
    }
  }, []);

  return (
    <div className="w-full relative h-fit">
      <Input
        placeholder="Wyszukaj płatność..."
        className="!ring-0 !ring-offset-0 w-full pl-8"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearched(e.target.value);
        }}
        value={searched}
      />
      <Search className="w-4 h-4 opacity-75 text-muted-foreground absolute left-2 top-1/2 translate-y-[-50%]" />
    </div>
  );
}
