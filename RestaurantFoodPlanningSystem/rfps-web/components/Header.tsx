"use client"

import {Button, Divider, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "../app/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import {PressEvent} from "@react-types/shared";

export default function HeaderComponent() {
    const [activeItem, setActiveItem] = useState("");
    const pathName = usePathname();
    const router = useRouter();
    const {
        user,
        logout
    } = useAuth();
    
    useEffect(() => {
        setActiveItem(pathName.split("/").pop() ?? "");
    }, [pathName]);

    const handleLogOut = (e: PressEvent) => {
        logout();
        router.push("/login");
    }

    const handlePlaceOrder = (e: PressEvent) => {
        router.push("/order");
    }
    
    if (!pathName.split("/").includes("dashboard")) {
        return (
            <Navbar position={"static"}
                    isBordered={true}
                    maxWidth={"full"}
                    className={"p-4 justify-evenly"}
            >
                <NavbarBrand className={"flex-col items-start"}>
                    <p>Hello! <span className="font-bold text-inherit underline mr-4">{user?.userName}</span></p>
                    <Button endContent={<FontAwesomeIcon icon={faDoorOpen}/>}
                            size={"sm"}
                            variant={"ghost"}
                            onPress={handleLogOut}
                    >
                        Log out
                    </Button>
                </NavbarBrand>
                <NavbarContent className={"flex gap-4"} justify={"center"}>
                    <NavbarItem 
                    >
                        <Link href={user?.role.includes("Manager") ? "/dashboard/user" : "dashboard/menu"}
                              color={"foreground"}>
                            Go to Dashboard
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        );
    } else {
        return (
            <Navbar position={"static"}
                    isBordered={true}
                    maxWidth={"full"}
                    className={"p-4"}
            >
                <NavbarBrand className={"flex-col"}>
                    <p>Hello! <span className="font-bold text-inherit underline">{user?.userName}</span></p>
                    <Button endContent={<FontAwesomeIcon icon={faDoorOpen}/>}
                            size={"sm"}
                            variant={"ghost"}
                            onPress={handleLogOut}
                    >
                        Log out
                    </Button>
                    <Button endContent={<FontAwesomeIcon icon={faCheck}/>}
                            size={"sm"}
                            variant={"ghost"}
                            onPress={handlePlaceOrder}
                            className={"mt-1"}
                    >
                        Place Order
                    </Button>
                </NavbarBrand>
                
                <NavbarContent className={"flex gap-4"} justify={"center"}>
                    <NavbarItem  isActive={activeItem === "user"}
                                hidden={!user?.role.includes("Manager")}>
                        <Link href={"/dashboard/user"} color={"foreground"}>
                            User Management
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" />
                    <NavbarItem  isActive={activeItem === "menu"}>
                        <Link href={"/dashboard/menu"} color={"foreground"}>
                            Menu Management
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" />
                    <NavbarItem  isActive={activeItem === "menu-item"}>
                        <Link href={"/dashboard/menu-item"} color={"foreground"}>
                            Menu Item Management
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" />
                    <NavbarItem  isActive={activeItem === "ingredient"}>
                        <Link href={"/dashboard/ingredient"} color={"foreground"}>
                            Ingredient Management
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" />
                    <NavbarItem  isActive={activeItem === "order"}>
                        <Link href={"/dashboard/order"} color={"foreground"}>
                            Order Management
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" />
                    <NavbarItem  isActive={activeItem === "unit"}>
                        <Link href={"/dashboard/unit"} color={"foreground"}>
                            Unit Management
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" />
                    <NavbarItem  isActive={activeItem === "type"}>
                        <Link href={"/dashboard/type"} color={"foreground"}>
                            Type Management
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        );
    }
}