"use client"

import HttpServices from "../../lib/HttpServices";
import {useAuth} from "../AuthContext";
import React, {useEffect, useState} from "react";
import OrderPlacementQueryDto from "../../lib/models/order/OrderPlacementQueryDto";
import OrderPlacementDto from "../../lib/models/order/OrderPlacementDto";
import {Button, Select, SelectItem, Spinner, useDisclosure} from "@nextui-org/react";
import OrderItemQueryDto from "../../lib/models/order/OrderItemQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";
import FooterComponent from "../../components/Footer";
import HeaderComponent from "../../components/Header";
import Modals from "../../components/CustomModal";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import {toast} from "react-toastify";
import MenuQueryDto from "../../lib/models/menu/MenuQueryDto";
import MenuDto from "../../lib/models/menu/MenuDto";

export default function OrderComponent() {
    const httpServices = new HttpServices();
    const {
        token,
        user
    } = useAuth();
    const router = useRouter();
    const [menu, setMenu] = useState<BasicDto<MenuDto>>({
        error    : "",
        isSuccess: false,
        value    : {
            amount   : 0,
            resultDto: [{
                date    : new Date(),
                id      : 0,
                menuItem: {
                    id  : 0,
                    name: ""
                }
            }]
        }
    });
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [valid, setValid] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const menuAPI: string = "/DataManagement/menu";
    const orderPlacementAPI: string = "/Order";
    

    const [orderPlacementDto, setOrderPlacementDto] = useState<OrderPlacementQueryDto>()

    const retrieveMenu = async function (menuQuery: MenuQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuAPI}/read`, menuQuery, "POST", token)).json();
            return response as BasicDto<MenuDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const createOrder = async function () {
        try {
            let response = await (await httpServices.callAPI(`${orderPlacementAPI}/place-order`, orderPlacementDto, "POST", token)).json();
            return response as BasicDto<OrderPlacementDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const updateOrder = async function (selectedMenuItemId: string[]) {
        setSelectedItems(selectedMenuItemId);
        setValid(true);
        setOrderPlacementDto({
            order     : {
                id        : null,
                isCanceled: false
            },
            orderItems: selectedMenuItemId.map(id => new OrderItemQueryDto(null, null, parseInt(id)))
        });
    }

    const confirmOrder = () => {
        (async () => {
            try {
                if (!orderPlacementDto?.orderItems) {
                    setValid(false);
                    return;
                } else {
                    if (orderPlacementDto?.orderItems.length < 1) {
                        setValid(false);
                        return;
                    }
                }

                const createRes = await createOrder();

                if (!createRes){
                    showToast("Failed to create order.");
                    return;
                }
                
                if (!createRes.isSuccess) {
                    showToast(`Fail - ${createRes.error}`);
                    return;
                }

                setSelectedItems([]);
                setOrderPlacementDto(undefined);
                setValid(true);
                showToast("Successfully create a new order");
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed")
                }
            }
        })();
    }

    const showToast = (message: string) => {
        toast(message);
    }

    useEffect(() => {
        if (!token || !user) {
            router.push("/login");
        }
        (async () => {
            try {
                const retrieveRes = await retrieveMenu({
                    id  : null,
                    date       : new Date().toDateString(),
                    menuItem_Id: null
                });

                if (!retrieveRes){
                    showToast("Failed to retrieve menu items.");
                    return;
                }
                
                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                setMenu(retrieveRes);
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed")
                }
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <>
                <div className={"w-dvw h-dvh flex flex-col items-center justify-center"}>
                    <Spinner/>
                </div>
            </>

        );
    }
    
    return (
        <>
            <HeaderComponent/>
            <div className={"w-full flex flex-col items-center"}>
                <h1 className={"m-4"}>Place your order!!!!</h1>
                <div className={"w-1/2"}>
                    <Select label={"Course"}
                            selectionMode={"multiple"}
                            placeholder={"Select your course"}
                            selectedKeys={selectedItems}
                            isRequired={true}
                            isInvalid={!valid}
                            errorMessage={"Must select a course"}
                            onSelectionChange={(key) => updateOrder(Array.from(key, opt => opt.toString()))}
                    >
                        {

                            menu.value.resultDto.map(mItem =>
                                <SelectItem key={mItem.id} textValue={mItem.menuItem.name}>
                                    {mItem.menuItem.name}
                                </SelectItem>
                            )
                        }
                    </Select>
                    <p className="text-small text-default-500 p-4">Selected Courses:</p>
                    <ol className={"list-decimal list-inside ps-4"}>
                        {
                            selectedItems.map((id, index) =>
                                <li key={index}>
                                    {
                                        menu.value.resultDto.filter(item => item.menuItem.id.toString() === id)[0].menuItem.name
                                    }
                                </li>
                            )
                        }
                    </ol>
                    <Button startContent={"Confirm your order"}
                            endContent={<FontAwesomeIcon icon={faCheck} textAnchor={"Log out"}/>}
                            size={"sm"}
                            variant={"ghost"}
                            onPress={confirmOrder}
                    />
                </div>
            </div>
            <FooterComponent/>
        </>
    );
}