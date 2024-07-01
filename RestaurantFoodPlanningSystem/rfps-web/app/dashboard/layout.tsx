"use client"

import {useAuth} from "../AuthContext";
import React from "react";
import {useRouter} from "next/navigation";

const DashboardLayout = ({children}: { children: React.ReactNode }) => {
    const {token, logout} = useAuth();
    const router = useRouter();
    
    if (!token){
        router.push("/login");
    }
    
    return <div>Dashboard { children}</div>;
}

export default DashboardLayout;