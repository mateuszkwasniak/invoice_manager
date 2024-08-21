"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Filter({
  paramName,
  label,
  items,
  placeholder,
}: {
  paramName: string;
  label: string;
  items: { [key: string]: string };
  placeholder: string;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    if (filter !== null) {
      const paramAsString = params.get(paramName) ? params.get(paramName) : "";
      if (paramAsString !== filter) {
        const paramsObj = Object.fromEntries(params.entries());
        delete paramsObj?.page;

        if (filter === "") {
          delete paramsObj[paramName];
          setFilter(null);
        } else {
          paramsObj[paramName] = filter;
        }

        router.replace(
          pathname + `?${new URLSearchParams(paramsObj).toString()}`
        );
      }
    }
  }, [filter, params, pathname, router, paramName]);

  useEffect(() => {
    if (params.get(paramName)) {
      setFilter(params.get(paramName));
    }
  }, []);

  return (
    <Select
      onValueChange={(val) => {
        if (val === "clear") {
          setFilter("");
        } else setFilter(val);
      }}
      defaultValue=""
      value={filter || ""}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {Object.entries(items).map((item) => (
            <SelectItem value={item[1]} key={item[1]}>
              {item[0]}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectItem value="clear" className="text-muted-foreground">
            Wyczyść
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
