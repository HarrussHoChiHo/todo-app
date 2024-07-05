"use client"

import {useAuth} from "../AuthContext";
import {NextPage} from "next";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import HeaderComponent from "../../components/Header";
import UserTable from "./UserTable";

const DashboardComponent: NextPage = () => {
    return (
        <div>
            Dashboard
            <UserTable/>
        </div>
    );
}

export default DashboardComponent;