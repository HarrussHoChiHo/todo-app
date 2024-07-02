'use client'

import React, {useState} from "react";
import {NextPage} from "next";
import HttpServices from "../lib/HttpServices";
import {redirect, useRouter} from "next/navigation";
import LoginQueryDto from "../lib/models/LoginQueryDto";
import {useAuth} from "../AuthContext";


interface LoginState {
    username: string;
    password: string;
    hidden: boolean;
}

const LoginComponent: NextPage = () => {
    const router                  = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hidden, setHidden]     = useState(true);
    const api                     = new HttpServices();
    const {login} = useAuth();
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        api.callAPI("/User/login", new LoginQueryDto(username, password), "POST").then(r => {
            if (r.status === 200) {
                r.json().then(res => {
                    console.log(res);
                    login(res.value.token);
                    router.push("/dashboard");
                });
                
            } else {
                setHidden(true);
            }
        });
    }

    return (<div className={"flex flex-col justify-center items-center h-screen"}>
        <div className={"w-1/4 flex flex-col justify-center items-center"}>
            <h2 className={"text-center mb-4 w-full"}>Login</h2>
            <input type={"text"}
                   placeholder={"Enter your username"}
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className={"mb-4 border-2 w-full"}
                   required={true}
            />
            <input type={"password"}
                   placeholder={"Enter your password"}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className={"mb-4 border-2 w-full"}
                   required={true}
            />
            <button type={"submit"}
                    color={"primary"}
                    className={"w-full border-2"}
                    onClick={handleLogin}
            >Submit
            </button>
            <p hidden={hidden}>Invalid Username and password.</p>
        </div>
    </div>);
}

export default LoginComponent;