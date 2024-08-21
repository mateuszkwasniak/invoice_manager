"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "../../ui/checkbox";
import { useContext } from "react";
import { CheckboxContext } from "@/context/CheckboxContext";

export default function ClientCheckboxMain({ data }: { data: string[] }) {
  const { allSelected, setAllSelected, setSelectedItems } =
    useContext(CheckboxContext);

  useEffect(() => {
    allSelected ? setSelectedItems(data) : setSelectedItems([]);
  }, [allSelected]);

  useEffect(() => {
    if (allSelected) {
      setSelectedItems(data);
    }
  }, [data]);

  return (
    <Checkbox
      checked={allSelected}
      onCheckedChange={(checked) => {
        checked ? setAllSelected(true) : setAllSelected(false);
      }}
    />
  );
}
