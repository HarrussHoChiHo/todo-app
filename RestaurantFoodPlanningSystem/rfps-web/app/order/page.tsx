"use client"

import HttpServices from "../../lib/HttpServices";
import {useAuth} from "../AuthContext";
import React, {useEffect, useState} from "react";
import MenuItemDto from "../../lib/models/menu/MenuItemDto";
import OrderPlacementQueryDto from "../../lib/models/order/OrderPlacementQueryDto";
import OrderPlacementDto from "../../lib/models/order/OrderPlacementDto";
import {Button, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import OrderItemQueryDto from "../../lib/models/order/OrderItemQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";
import FooterComponent from "../../components/Footer";
import HeaderComponent from "../../components/Header";
import Modals from "../../components/CustomModal";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";

export default function OrderComponent() {
    const httpServices = new HttpServices();
    const {
        token,
        user
    } = useAuth();
    const router = useRouter();
    const [menuItem, setMenuItem] = useState<BasicDto<MenuItemDto>>({
        error    : "",
        isSuccess: false,
        value    : {
            amount   : 0,
            resultDto: [{
                id  : 0,
                name: ""
            }]
        }
    });
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [valid, setValid] = useState(true);
    const [creationResult, setCreationResult] = useState(true);
    const menuItemAPI: string = "/DataManagement/menu-item";
    const orderPlacementAPI: string = "/Order";

    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();

    const [orderPlacementDto, setOrderPlacementDto] = useState<OrderPlacementQueryDto>()

    const retrieveMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const createOrder = async function () {
        let response = await (await httpServices.callAPI(`${orderPlacementAPI}/place-order`, orderPlacementDto, "POST", token)).json();
        return response as BasicDto<OrderPlacementDto>;
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
            if (!orderPlacementDto?.orderItems) {
                setValid(false);
            } else {
                if (orderPlacementDto?.orderItems.length < 1) {
                    setValid(false);
                }
            }

            const createRes = await createOrder();

            if (!createRes.isSuccess) {
                setCreationResult(false);
                onOpen();
                return;
            }
            setCreationResult(true);
            setSelectedItems([]);
            setOrderPlacementDto(undefined);
            setValid(true);

        })();
    }


    useEffect(() => {
        if (!token || !user) {
            router.push("/login");
        }
        (async () => {
            const retrieveRes = await retrieveMenuItem({
                id  : null,
                name: null
            });

            if (!retrieveRes.isSuccess) {
                throw new Error("Failed to retrieve menu items");
            }
            setMenuItem(retrieveRes);
        })();
    }, []);

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
                            menuItem.value.resultDto.map(item =>
                                <SelectItem key={item.id}>
                                    {item.name}
                                </SelectItem>
                            )
                        }
                    </Select>
                    <p className="text-small text-default-500 p-4">Selected Courses:</p>
                    <ol className={"list-decimal list-inside ps-4"}>
                        {
                            selectedItems.map((id, index) =>
                                <li key={index}>
                                    {menuItem.value.resultDto.filter(item => item.id.toString() === id)[0].name}
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
            <Modals isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onCancel={onClose}
                    onConfirm={onClose}
                    header={"Notification"}
            >
                {
                    creationResult ? (
                        <p className={"flex flex-row justify-center items-center"}>Success <FontAwesomeIcon
                            icon={faCircleCheck} size={"2xl"} className={"p-2"}/></p>) : (
                        <p className={"flex flex-row justify-center items-center"}>Fail<FontAwesomeIcon
                            icon={faCircleExclamation} size={"2xl"} className={"p-2"}/></p>)
                }
            </Modals>
        </>
    );
}