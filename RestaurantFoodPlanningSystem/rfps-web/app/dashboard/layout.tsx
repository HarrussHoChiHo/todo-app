"use client"

import {useAuth} from "../AuthContext";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";

const DashboardLayout = ({children}: { children: React.ReactNode }) => {
    const {token, logout} = useAuth();
    const router          = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, []);
    
    return (<div><HeaderComponent/><div className={"flex flex-col justify-center items-center w-6/12 ml-auto mr-auto pt-8 pb-8"}>{children}</div><FooterComponent /></div>);
}

export default DashboardLayout;