"use client";

import React, { useContext } from "react";
import { Checkbox } from "../../ui/checkbox";
import { CheckboxContext } from "@/context/CheckboxContext";

export default function ClientCheckbox({ itemId }: { itemId: string }) {
  const { selectedItems, setSelectedItems, allSelected } =
    useContext(CheckboxContext);

  return (
    <Checkbox
      onClick={(e) => e.stopPropagation()}
      checked={selectedItems.includes(itemId)}
      onCheckedChange={(checked) => {
        checked
          ? setSelectedItems((prev) => [...prev, itemId])
          : setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      }}
    />
  );
}
