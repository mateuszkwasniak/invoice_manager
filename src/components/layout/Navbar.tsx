import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { HomeIcon, Building2 } from "lucide-react";
import CompanyProjectModal from "../modals/CompanyProjectModal";
import ProfileButton from "../buttons/ProfileButton";
import {
  HandCoins,
  LucideBarChart4,
  Settings,
  CirclePlus,
  ScrollText,
  Factory,
  FolderSearch,
} from "lucide-react";
import CustomNavigationMenuItem from "../navigation/CustomNavigationMenuItem";
import MobileMenu from "../navigation/MobileMenu";
import CompanyNavbarLink from "../navigation/CompanyNavbarLink";
import ProjectNavbarLink from "../navigation/ProjectNavbarkLink";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full px-2 md:px-10 py-2 flex items-center border-b shadow-sm border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="hidden lg:flex items-center flex-1 mr-8">
        <Link
          href="/"
          className={`${navigationMenuTriggerStyle()} [&:hover>svg]:translate-y-[-10%] mr-1`}
        >
          <HomeIcon className="w-5 h-5 mr-1.5 opacity-85 transition duration-300" />{" "}
          Główna
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/projects" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:translate-y-[-10%]`}
                >
                  <Building2 className="w-5 h-5 mr-1.5 opacity-85 transition duration-300" />
                  Projekty i Firmy
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/settings" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} [&:hover>svg]:rotate-180`}
                >
                  <Settings className="w-5 h-5 mr-1.5 opacity-85 transition duration-300" />
                  Ustawienia
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="block lg:hidden">
        <MobileMenu />
      </div>
      <div className="flex gap-4 items-center ml-auto">
        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList>
            <CustomNavigationMenuItem>
              <NavigationMenuTrigger className="[&:hover>svg]:translate-y-[-10%]">
                <HandCoins className="w-5 h-5 mr-1.5 opacity-85 transition duration-300" />
                Płatności
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[260px] flex h-fit p-3 gap-2">
                  <li className="flex-1 h-10">
                    <Link href="/payments/new" legacyBehavior passHref>
                      <NavigationMenuLink className="w-full h-full flex items-center select-none text-sm rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-nowrap">
                        <CirclePlus className="w-5 h-5 mr-1.5 opacity-85" />
                        Dodaj
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <div className="w-[1px] mt-0 mb-0 bg-muted-foreground opacity-25" />
                  <li className="flex-1 h-10">
                    <CompanyNavbarLink href="payments">
                      <NavigationMenuLink className="w-full h-full flex items-center select-none text-sm rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-nowrap">
                        <ScrollText className="w-5 h-5 mr-1.5 opacity-85" />
                        Przeglądaj
                      </NavigationMenuLink>
                    </CompanyNavbarLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </CustomNavigationMenuItem>
            <CustomNavigationMenuItem>
              <NavigationMenuTrigger className="[&:hover>svg]:translate-y-[-10%]">
                <LucideBarChart4 className="w-5 h-5 mr-1.5 opacity-85 transition duration-300" />
                Analiza
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[260px] flex gap-2 h-fit p-3">
                  <li className="flex-1 h-10">
                    <CompanyNavbarLink href="summary">
                      <NavigationMenuLink className="w-full h-full flex items-center select-none text-sm rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-nowrap">
                        <Factory className="w-5 h-5 mr-1.5 opacity-85" />
                        Firma
                      </NavigationMenuLink>
                    </CompanyNavbarLink>
                  </li>
                  <div className="w-[1px] mt-0 mb-0 bg-muted-foreground opacity-25" />
                  <li className="flex-1 h-10">
                    <ProjectNavbarLink href="summary">
                      <NavigationMenuLink className="w-full h-full flex items-center select-none text-sm rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-nowrap">
                        <FolderSearch className="w-5 h-5 mr-1.5 opacity-85" />
                        Projekt
                      </NavigationMenuLink>
                    </ProjectNavbarLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </CustomNavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <CompanyProjectModal />
        <ProfileButton />
      </div>
    </header>
  );
}
