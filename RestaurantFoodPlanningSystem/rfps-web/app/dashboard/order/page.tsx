"use client"
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import {Checkbox, Select, SelectItem, Spinner, useDisclosure} from "@nextui-org/react";
import OrderDto from "../../../lib/models/order/OrderDto";
import OrderQueryDto from "../../../lib/models/order/OrderQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modals from "../../../components/CustomModal";
import OrderItemDto from "../../../lib/models/order/OrderItemDto";
import {toast} from "react-toastify";

export default function OrderComponent() {
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [headers, setHeaders] = useState<string[]>([]);
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
            id: 0,
            isCanceled: false,
            orderItems: []
        }
    );

    const [order, setOrder] = useState<BasicDto<OrderDto>>(
        {
            error: "",
            isSuccess: false,
            value: {
                amount: 0,
                resultDto: [{
                    id: 0,
                    isCanceled: false,
                    orderItems: [{
                        id: 0,
                        orderId: 0,
                        menuItem: {
                            id: 0,
                            name: ""
                        }
                    }]
                }]
            }
        });
    const [isCanceled, setIsCanceled] = useState("false");
    const [isLoading, setIsLoading] = useState(true);
    let orderItemList: number[] = [];


    const handleDelete = (id: number) => {
        (async() => {
            try {
                const serverRes = await deleteOrder(id);
                
                if (!serverRes) {
                    showToast("Failed to retrieve order.");
                    return;
                }

                if (!serverRes.isSuccess) {
                    showToast(`Fail - ${serverRes.error}`);
                    return;
                }
                
                const retrieveRes = await retrieveOrder({id: null, isCanceled: null});
                
                if (!retrieveRes){
                    showToast("Failed to retrieve updated order");
                    return;
                }
                
                if (!retrieveRes.isSuccess){
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                setOrder(retrieveRes);
                
                setEditObj(serverRes.value.resultDto[0]);
                setIsCanceled(`${serverRes.value.resultDto[0].isCanceled}`);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })();
    }

    const handleEdit = (id: number) => {
        (async () => {
            try {
                let serverRes = await retrieveOrder({
                    id        : id,
                    isCanceled: null
                });

                if (!serverRes) {
                    showToast("Failed to retrieve order.");
                    return;
                }

                if (!serverRes.isSuccess) {
                    showToast(`Fail - ${serverRes.error}`);
                    return;
                }
                
                setEditObj(serverRes.value.resultDto[0]);
                setIsCanceled(`${serverRes.value.resultDto[0].isCanceled}`);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })().finally(() => onOpen());
    }


    const updateStatus = (status: string[]) => {
        setIsCanceled(status[0]);
    }

    const retrieveOrder = async (orderQueryDto: OrderQueryDto) => {
        try {
            let server_res = await (await httpServices.callAPI(`${orderAPI}/read`, orderQueryDto, "POST", token)).json();
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
            let server_res = await (await httpServices.callAPI(`${orderAPI}/${id}`, null, "DELETE", token)).json();
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
            let server_res = await (await httpServices.callAPI(`${orderAPI}/update`, orderQueryDto, "POST", token)).json();
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
            let server_res = await (await httpServices.callAPI(`${orderItemAPI}/${id}`, null, "DELETE", token)).json();
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
            try {
                if (orderItemList) {
                    const updateRes = await updateOrder({
                        id        : editObj.id,
                        isCanceled: (isCanceled === "true")
                    });
                    if (!updateRes) {
                        showToast("Failed to update order.");
                        return;
                    }

                    if (!updateRes.isSuccess) {
                        showToast(`Fail - ${updateRes.error}`);
                        return;
                    }

                    const promiseList = orderItemList.map(item => deleteOrderItem(item));
                    let serverRes = await Promise.all(promiseList);
                    
                    let failedServerRes = serverRes.filter(res => !res!.isSuccess);
                    if (failedServerRes.length > 0) {
                        showToast("Failed to update order item");
                        return;
                    }

                    let retrieveServerRes = await retrieveOrder({
                        id        : null,
                        isCanceled: null
                    });

                    if (!retrieveServerRes) {
                        showToast("Failed to retrieve update order");
                        return;
                    }

                    if (!retrieveServerRes.isSuccess) {
                        showToast(`Fail - ${retrieveServerRes.error}`);
                        return;
                    }
                    setOrder(retrieveServerRes);
                }
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })().finally(() => onClose());
    }

    const updateOrderItemList = (checked: boolean, orderItemId: number) => {
        if (!checked) {
            orderItemList.push(orderItemId);
        } else {
            orderItemList = orderItemList.filter(id => id !== orderItemId);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                let retrieveResult = await retrieveOrder({
                    id        : null,
                    isCanceled: null
                });

                if (!retrieveResult) {
                    showToast("Failed to retrieve order.");
                    return;
                }

                if (!retrieveResult.isSuccess) {
                    showToast(`Fail - ${retrieveResult.error}`);
                    return;
                }
                
                setOrder(retrieveResult);
                setHeaders(Object.keys(new OrderDto(0, false, [])));
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })();
    }, []);

    const showToast = (message: string) => {
        toast(message);
    }
    
    const renderContent = () => {
        return (
            <>
                <Select label={"Order Status"}
                        selectionMode={"single"}
                        selectedKeys={[isCanceled]}
                        onSelectionChange={(option) => updateStatus(Array.from(option, opt => opt.toString()))}
                >
                    <SelectItem key={"false"} value={"false"}>
                        {"Not Canceled"}
                    </SelectItem>
                    <SelectItem key={"true"} value={"true"}>
                        {"Canceled"}
                    </SelectItem>
                </Select>
                {
                    editObj.orderItems.map(iorder =>
                        <Fragment key={iorder.id}>
                            <div className={"flex flex-row w-full"}>
                                <Checkbox defaultSelected
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

    if (isLoading) {
        return <Spinner/>;
    }
    
    return (
        <>
            <div className={"grid grid-cols-5 w-full"}>
                {
                    headers.map((header, index) => (
                        <Fragment key={header}>
                            <div className={"font-extrabold gird-style text-center"}>
                                {header}
                            </div>
                        </Fragment>
                    ))
                }
                <Fragment key={"header_delete"}>
                    <div className={"font-extrabold gird-style text-center"}>
                        Delete
                    </div>
                </Fragment>
                <Fragment key={"header_edit"}>
                    <div className={"font-extrabold gird-style text-center"}>
                        Edit
                    </div>
                </Fragment>
                {
                    order.value.resultDto.map((orderDto, index) => {
                        return (
                            <Fragment key={orderDto.id}>
                                <div className={"p-4 gird-style text-center"}>
                                    {orderDto.id}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {orderDto.isCanceled ? "Yes" : "No"}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <ol>
                                        {
                                            orderDto.orderItems.map(item =>
                                                <li key={item.id}>
                                                    {item.menuItem.name}
                                                </li>
                                            )
                                        }
                                    </ol>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleDelete(orderDto.id)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleEdit(orderDto.id)}>
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                    </button>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
            <Modals isOpen={isOpen}
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