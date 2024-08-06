"use client"

import {useAuth} from "../AuthContext";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";

const DashboardLayout = ({children}: {
    children: React.ReactNode
}) => {
    const {
        token,
        user
    } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (!token || !user) {
            router.push("/");
        }
        
        // if (!user?.role.includes("Manager")){
        //     router.push("/place-order")
        // }
        setIsLoading(false);
    }, [router]);

    return (
        <div>
            {
                (
                    <>
                        <HeaderComponent/>
                        <div className={"flex flex-col justify-center items-center w-6/12 ml-auto mr-auto pt-8 pb-8"}>
                            {!isLoading && children}
                        </div>
                        <FooterComponent/>
                    </>
                )
            }
        </div>);
}

export default DashboardLayout;