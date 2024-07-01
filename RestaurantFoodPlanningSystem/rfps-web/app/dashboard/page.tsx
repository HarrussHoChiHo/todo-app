"use client"

import {useAuth} from "../AuthContext";
import {NextPage} from "next";

const DashboardComponent: NextPage = () => {
    const {token} = useAuth();
    
    return <div>Dashboard</div>;
}

export default DashboardComponent;