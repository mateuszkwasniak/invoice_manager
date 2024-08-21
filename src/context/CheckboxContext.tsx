"use client";

import React, { createContext, useState } from "react";

type CheckboxContextType = {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  allSelected: boolean;
  setAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CheckboxContext = createContext<CheckboxContextType>({
  selectedItems: [],
  setSelectedItems: () => {},
  allSelected: false,
  setAllSelected: () => {},
});

export default function CheckboxContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  return (
    <CheckboxContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
        allSelected,
        setAllSelected,
      }}
    >
      {children}
    </CheckboxContext.Provider>
  );
}
