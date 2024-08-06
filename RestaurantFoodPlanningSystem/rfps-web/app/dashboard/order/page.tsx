"use client"

import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";
import OrderDto, {orderHeaders, orderHeadersStaff} from "../../../lib/models/order/OrderDto";
import OrderQueryDto from "../../../lib/models/order/OrderQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modals from "../../../components/CustomModal";
import OrderItemDto from "../../../lib/models/order/OrderItemDto";
import {toast} from "react-toastify";

export default function OrderComponent() {
    const httpServices = new HttpServices();
    const {
        token,
        user
    } = useAuth();
    const orderAPI: string = "/DataManagement/order";
    const orderItemAPI: string = "/DataManagement/order-item";
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();

    const [editObj, setEditObj] = useState<OrderDto>(
        {
            id        : 0,
            isCanceled: false,
            orderItems: []
        }
    );

    const [order, setOrder] = useState<BasicDto<OrderDto>>(
        {
            error    : "",
            isSuccess: false,
            value    : {
                amount   : 0,
                resultDto: [{
                    id        : 0,
                    isCanceled: false,
                    orderItems: [{
                        id      : 0,
                        orderId : 0,
                        menuItem: {
                            id  : 0,
                            name: ""
                        }
                    }]
                }]
            }
        });
    const [isCanceled, setIsCanceled] = useState("false");
    const [isLoading, setIsLoading] = useState(true);
    const [orderItemList, setOrderItemList] = useState<number[]>([]);


    const handleDelete = (id: number) => {
        (async () => {
            const serverRes = await deleteOrder(id);

            if (!serverRes) {
                throw new Error("Failed to retrieve place-order.");
            }

            if (!serverRes.isSuccess) {
                throw new Error(`Fail - ${serverRes.error}`);
            }

            const retrieveRes = await retrieveOrder({
                id        : null,
                isCanceled: null
            });

            if (!retrieveRes) {
                throw new Error("Failed to retrieve updated place-order");
            }

            if (!retrieveRes.isSuccess) {
                throw new Error(`Fail - ${retrieveRes.error}`);
            }

            setOrder(retrieveRes);

            setEditObj(serverRes.value.resultDto[0]);
            setIsCanceled(`${serverRes.value.resultDto[0].isCanceled}`);
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        });
    }

    const handleEdit = (id: number) => {
        (async () => {
            const serverRes = await retrieveOrder({
                id        : id,
                isCanceled: null
            });

            if (!serverRes) {
                throw new Error("Failed to retrieve place-order.");
            }

            if (!serverRes.isSuccess) {
                throw new Error(`Fail - ${serverRes.error}`);
            }

            setEditObj(serverRes.value.resultDto[0]);
            setIsCanceled(`${serverRes.value.resultDto[0].isCanceled}`);
            onOpen();
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        });
    }


    const updateStatus = (status: string[]) => {
        setIsCanceled(status[0]);
    }

    const retrieveOrder = async (orderQueryDto: OrderQueryDto) => {
        try {
            const server_res = await (await httpServices.callAPI(`${orderAPI}/read`, orderQueryDto, "POST", token)).json();
            return server_res as BasicDto<OrderDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const deleteOrder = async (id: number) => {
        try {
            const server_res = await (await httpServices.callAPI(`${orderAPI}/${id}`, null, "DELETE", token)).json();
            return server_res as BasicDto<OrderDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const updateOrder = async (orderQueryDto: OrderQueryDto) => {
        try {
            const server_res = await (await httpServices.callAPI(`${orderAPI}/update`, orderQueryDto, "POST", token)).json();
            return server_res as BasicDto<OrderDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const deleteOrderItem = async (id: number) => {
        try {
            const server_res = await (await httpServices.callAPI(`${orderItemAPI}/${id}`, null, "DELETE", token)).json();
            return server_res as BasicDto<OrderItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const cancelEdition = () => {
        onClose();
    }

    const confirmEdition = () => {
        (async () => {
            if (orderItemList) {
                const updateRes = await updateOrder({
                    id        : editObj.id,
                    isCanceled: (isCanceled === "true")
                });
                if (!updateRes) {
                    throw new Error("Failed to update place-order.");
                }

                if (!updateRes.isSuccess) {
                    throw new Error(`Fail - ${updateRes.error}`);
                }

                const promiseList = orderItemList.map(item => deleteOrderItem(item));
                const serverRes = await Promise.all(promiseList);

                const failedServerRes = serverRes.filter(res => !res!.isSuccess);

                if (failedServerRes.length > 0) {
                    throw new Error("Failed to update place-order item");
                }

                const retrieveServerRes = await retrieveOrder({
                    id        : null,
                    isCanceled: null
                });

                if (!retrieveServerRes) {
                    throw new Error("Failed to retrieve update place-order");
                }

                if (!retrieveServerRes.isSuccess) {
                    throw new Error(`Fail - ${retrieveServerRes.error}`);
                }
                setOrder(retrieveServerRes);
                onClose();
            }
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        });
    }

    const updateOrderItemList = (checked: boolean, orderItemId: number) => {
        if (!checked) {
            setOrderItemList([...orderItemList, orderItemId]);
        } else {
            setOrderItemList(orderItemList.filter(id => id !== orderItemId));
        }
    }

    useEffect(() => {
        (async () => {
            const retrieveResult = await retrieveOrder({
                id        : null,
                isCanceled: null
            });

            if (!retrieveResult) {
                throw new Error("Failed to retrieve place-order.");
            }

            if (!retrieveResult.isSuccess) {
                throw new Error(`Fail - ${retrieveResult.error}`);
            }

            setOrder(retrieveResult);
            setIsLoading(false);
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        });
    }, []);

    const showToast = (message: string) => {
        toast(message);
    }

    const renderContent = () => {
        return (
            <>
                <Select
                    label={"Order Status"}
                    selectionMode={"single"}
                    selectedKeys={[isCanceled]}
                    onSelectionChange={(option) => updateStatus(Array.from(option, opt => opt.toString()))}
                >
                    <SelectItem
                        key={"false"}
                        value={"false"}
                    >
                        {"Not Canceled"}
                    </SelectItem>
                    <SelectItem
                        key={"true"}
                        value={"true"}
                    >
                        {"Canceled"}
                    </SelectItem>
                </Select>
                {
                    editObj.orderItems.map(iorder =>
                        <Fragment key={iorder.id}>
                            <div className={"flex flex-row w-full"}>
                                <Checkbox
                                    defaultSelected
                                    onValueChange={(checked) => updateOrderItemList(checked, iorder.id)}
                                >
                                    {iorder.menuItem.name}
                                </Checkbox>
                            </div>
                        </Fragment>
                    )
                }
            </>
        )
    }

    const generateOptionalFields = () => {
        if (user?.role.includes("Manager")) {
            return (
                <TableBody emptyContent={"No rows to display."}>
                    {
                        order.value.resultDto.map((dto) =>
                            <TableRow key={dto.id}>
                                <TableCell>{dto.id}</TableCell>
                                <TableCell>{dto.isCanceled
                                            ? "Yes"
                                            : "No"}</TableCell>
                                <TableCell>
                                    {
                                        <ol>
                                            {
                                                dto.orderItems.map(item =>
                                                    <li key={item.id}>
                                                        {item.menuItem.name}
                                                    </li>
                                                )
                                            }
                                        </ol>
                                    }
                                </TableCell>
                                <TableCell width={"30px"}>
                                    <Button
                                        size={"sm"}
                                        onClick={() => handleDelete(dto.id)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            id={dto.id.toString()}
                                        />
                                    </Button>
                                </TableCell>
                                <TableCell width={"30px"}>
                                    <Button
                                        size={"sm"}
                                        onClick={() => handleEdit(dto.id)}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            );
        } else {
            return (
                <TableBody emptyContent={"No rows to display."}>
                    {
                        order.value.resultDto.map((dto) =>
                            <TableRow key={dto.id}>
                                <TableCell>{dto.id}</TableCell>
                                <TableCell>{dto.isCanceled
                                            ? "Yes"
                                            : "No"}</TableCell>
                                <TableCell>
                                    {
                                        <ol>
                                            {
                                                dto.orderItems.map(item =>
                                                    <li key={item.id}>
                                                        {item.menuItem.name}
                                                    </li>
                                                )
                                            }
                                        </ol>
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            );
        }
    }

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <Table
                aria-label={"Order"}
                topContent={<h1 className={"w-full text-center"}>Order Management</h1>}
            >
                <TableHeader>
                    {
                        user?.role.includes("Manager")
                        ?
                        orderHeaders.map(tableHeader => <TableColumn
                            key={tableHeader.key}
                        >{tableHeader.label}</TableColumn>)
                        : orderHeadersStaff.map(tableHeader => <TableColumn
                            key={tableHeader.key}
                        >{tableHeader.label}</TableColumn>)
                    }
                </TableHeader>
                {
                    generateOptionalFields()
                }
            </Table>
            <Modals
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onCancel={cancelEdition}
                onConfirm={confirmEdition}
                header={"Edit"}
                hideCloseButton={false}
            >
                {
                    renderContent()
                }
            </Modals>

        </>
    );
}