"use client"

import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {router} from "next/client";
import {usePathname} from "next/navigation";

export default function HeaderComponent() {
    const [activeItem, setActiveItem] = useState("");
    const pathName = usePathname();
    
    useEffect(() => {
        setActiveItem(pathName.split("/").pop() ?? "");
    }, [pathName]);
    
    return (
      <Navbar position={"static"} isBordered={true}>
          <NavbarContent className={"hidden sm:flex gap-4"} justify={"center"}>
              <NavbarItem isActive={activeItem === "user"}>
                  <Link href={"/dashboard/user"} color={"foreground"}>
                      User Management
                  </Link>
              </NavbarItem>
              <NavbarItem isActive={activeItem === "menu"}>
                  <Link href={"/dashboard/menu"} color={"foreground"}>
                      Menu Management
                  </Link>
              </NavbarItem>
              <NavbarItem isActive={activeItem === "ingredient"}>
                  <Link href={"/dashboard/ingredient"} color={"foreground"}>
                      Ingredient Management
                  </Link>
              </NavbarItem>
              <NavbarItem isActive={activeItem === "order"}>
                  <Link href={"/dashboard/menu"} color={"foreground"}>
                      Order Management
                  </Link>
              </NavbarItem>
          </NavbarContent>
      </Navbar>
    );
}