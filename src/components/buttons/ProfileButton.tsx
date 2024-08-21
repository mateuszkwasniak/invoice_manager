"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { signUserOut } from "@/actions/actions";
import { Button } from "../ui/button";

import { useSession } from "next-auth/react";

export default function ProfileButton() {
  const session = useSession();

  return (
    <Popover>
      <PopoverTrigger className="dark:bg-primary rounded-full dark:border dark:border-secondary/60">
        <Avatar>
          <AvatarImage src={session?.data?.user?.image || ""} />
          <AvatarFallback
            className="bg-primary dark:bg-background
          hover:opacity-65
          dark:hover:bg-accent text-secondary dark:text-primary rounded-full transition duration-300"
          >
            {session?.data?.user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={async () => {
              localStorage.removeItem("invoice_manager");
              await signUserOut();
            }}
          >
            Wyloguj się
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
