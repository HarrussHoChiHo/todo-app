"use client"

import {useAuth} from "../AuthContext";
import React, {Suspense, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import Modals from "../../components/CustomModal";
import {Spinner, useDisclosure} from "@nextui-org/react";

const DashboardLayout = ({children}: {
    children: React.ReactNode
}) => {
    const {
        token,
        logout,
        user
    } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();

    useEffect(() => {
        if (!token || !user) {
            router.push("/login");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    return (
        <div>
            {
                (<>
                        <Suspense fallback={<Spinner />}>
                            <HeaderComponent/>
                            <div
                                className={"flex flex-col justify-center items-center w-6/12 ml-auto mr-auto pt-8 pb-8"}>
                                {children}
                            </div>
                            <FooterComponent/>
                        </Suspense>
                    </>
                )
            }
        </div>);
}

export default DashboardLayout;