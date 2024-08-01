"use client"

import {Button} from "@nextui-org/react";
import LoginComponent from "./login/login";
import {useEffect, useState} from "react";
import {Image} from "@nextui-org/image";
import {useAuth} from "./AuthContext";
import {useRouter} from "next/navigation";

export default function Home() {
    const [showLoginPage, setShowLoginPage] = useState(false);
    
    
    const hideLoginPage = (state: boolean) => {
        setShowLoginPage(state);
    }
    const {
        token,
            user
    } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (!token || !user) {
            router.push("/");
        } else if (!user.role.includes("Manager")) {
            router.push("/place-order");
        } else {
            router.push("/dashboard");
        }
    }, [router]);
    
    return (
        <>
            <div className={"flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-r from-emerald-300 to-indigo-400"}>
                <Image src={"/MenuMaster.png"}
                       width={"250px"}
                       height={"250px"}
                />
                <h1 className={"font-serif text-white text-6xl m-4"}>Restaurant Food Planning System</h1>
                <Button
                    className={"bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"}
                        size={"lg"}
                    onClick={(event) => setShowLoginPage(true)}
                >
                    Login
                </Button>
            </div>
            {
                showLoginPage && <div
                    className={"size-full fixed z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none inset-0 focus:outline-none"}
                >
                    <LoginComponent closeLoginPage={hideLoginPage}/>
                </div>
            }
        </>
    );
}
