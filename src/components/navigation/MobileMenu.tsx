import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlignJustify,
  ListChecks,
  Plus,
  Settings,
  FolderSearch,
  FactoryIcon,
  Home,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuItem,
} from "@radix-ui/react-navigation-menu";
import { navigationMenuTriggerStyle } from "../ui/navigation-menu";
import CustomNavbarLink from "./CompanyNavbarLink";
import CustomNavigationMenuItem from "./CustomNavigationMenuItem";
import Link from "next/link";
import CompanyNavbarLink from "./CompanyNavbarLink";
import ProjectNavbarLink from "./ProjectNavbarkLink";

export default function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AlignJustify className="w-8 h-8 hover:scale-[1.05] hover:oapcity-85 transition duration-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <NavigationMenu className="w-[240px]">
          <NavigationMenuList>
            <CustomNavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:translate-y-[-10%] !w-full !justify-start`}
                >
                  <Home className="w-5 h-5 mr-4 opacity-85" />
                  Główna
                </NavigationMenuLink>
              </Link>
              <Link href="/payments/new" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:translate-y-[-10%] !w-full !justify-start`}
                >
                  <Plus className="w-5 h-5 mr-4 opacity-85" />
                  Nowa płatność
                </NavigationMenuLink>
              </Link>
            </CustomNavigationMenuItem>
            <CustomNavigationMenuItem>
              <CustomNavbarLink href="payments">
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:translate-y-[-10%] !w-full !justify-start`}
                >
                  <ListChecks className="w-5 h-5 mr-4 opacity-85" />
                  Wszystkie płatności
                </NavigationMenuLink>
              </CustomNavbarLink>
            </CustomNavigationMenuItem>
            <CustomNavigationMenuItem>
              <CompanyNavbarLink href="summary">
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:translate-y-[-10%] !w-full !justify-start`}
                >
                  <FactoryIcon className="w-5 h-5 mr-4 opacity-85 transition duration-300" />
                  Analiza firmy
                </NavigationMenuLink>
              </CompanyNavbarLink>
            </CustomNavigationMenuItem>
            <CustomNavigationMenuItem>
              <ProjectNavbarLink href="summary">
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:translate-y-[-10%] !w-full !justify-start`}
                >
                  <FolderSearch className="w-5 h-5 mr-4 opacity-85 transition duration-300" />
                  Analiza projektu
                </NavigationMenuLink>
              </ProjectNavbarLink>
            </CustomNavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/settings" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:rotate-180 !w-full !justify-start`}
                >
                  <Settings className="w-5 h-5 mr-4 opacity-85 transition duration-300" />
                  Ustawienia
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
