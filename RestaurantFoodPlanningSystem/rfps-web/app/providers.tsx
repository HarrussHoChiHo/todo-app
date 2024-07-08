"use client"

import {NextUIProvider} from "@nextui-org/react";
import React from "react";
import { AuthProvider } from "./AuthContext";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </AuthProvider>
    )
}