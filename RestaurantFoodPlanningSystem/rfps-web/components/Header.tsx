"use client"

import {
    Button,
    Divider,
    Dropdown, DropdownItem, DropdownMenu,
    DropdownTrigger,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@nextui-org/react";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "../app/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faDoorOpen, faPenNib} from "@fortawesome/free-solid-svg-icons";

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

    const handleLogOut = () => {
        logout();
        router.push("/login");
    }

    const handlePlaceOrder = () => {
        router.push("/order");
    }

    if (!pathName.split("/").includes("dashboard") || !user?.role.includes("Manager")) {
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
                {
                    user?.role.includes("Manager") ? (
                        <NavbarContent className={"flex gap-4"} justify={"center"}>
                            <NavbarItem>
                                <Link href={user?.role.includes("Manager") ? "/dashboard/user" : "dashboard/menu"}
                                      color={"foreground"}>
                                    Go to Dashboard
                                </Link>
                            </NavbarItem>
                        </NavbarContent>
                    ) : (
                        <>
                        </>
                    )
                }

            </Navbar>
        );
    } else {
        return (
            <Navbar position={"static"}
                    isBordered={true}
                    maxWidth={"full"}
                    height={"max-content"}
                    className={"m-0 p-0"}
            >
                <NavbarBrand className={"flex-col pt-4 pb-4"}>
                    <p>Hello! <span className="font-bold text-inherit underline">{user?.userName}</span></p>
                    <Button endContent={<FontAwesomeIcon icon={faDoorOpen}/>}
                            size={"sm"}
                            variant={"ghost"}
                            onPress={handleLogOut}
                    >
                        Log out
                    </Button>
                    <Button endContent={<FontAwesomeIcon icon={faPenNib}/>}
                            size={"sm"}
                            variant={"ghost"}
                            onPress={handlePlaceOrder}
                            className={"mt-1"}
                    >
                        Place Order
                    </Button>
                </NavbarBrand>
                <NavbarContent className={"flex w-full"} justify={"center"}>
                    <NavbarItem isActive={activeItem === "user"}>
                        <Link href={"/dashboard/user"} color={"foreground"}>
                            User
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical"/>
                    <NavbarItem isActive={activeItem === "order"}>
                        <Link href={"/dashboard/order"} color={"foreground"}>
                            Order
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical"/>
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button disableRipple
                                        endContent={<FontAwesomeIcon icon={faCaretDown}/>}
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                                        radius={"sm"}
                                        variant={"light"}
                                >
                                    Menu
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu selectionMode={"single"}
                                      selectedKeys={[activeItem]}
                        >
                            <DropdownItem key={"menu"} href={"/dashboard/menu"}>
                                Menu Management
                            </DropdownItem>
                            <DropdownItem key={"menu-item"} href={"/dashboard/menu-item"}>
                                Course Management
                            </DropdownItem>
                            <DropdownItem key={"menu-item-food-item"} href={"/dashboard/menu-item-food-item"}>
                                Menu Item Food Item Management
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Divider orientation="vertical"/>
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button disableRipple
                                        endContent={<FontAwesomeIcon icon={faCaretDown}/>}
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                                        radius={"sm"}
                                        variant={"light"}
                                >
                                    Food
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu selectionMode={"single"}
                                      selectedKeys={[activeItem]}
                        >
                            <DropdownItem key={"ingredient"} href={"/dashboard/ingredient"}>
                                Food Management
                            </DropdownItem>
                            <DropdownItem key={"unit"} href={"/dashboard/unit"}>
                                Unit Management
                            </DropdownItem>
                            <DropdownItem key={"type"} href={"/dashboard/type"}>
                                Type Management
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </Navbar>
        );
    }
}