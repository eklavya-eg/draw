"use client"

import { SERVER_URL } from "@/config";
import { AuthStore } from "@/stores/auth";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Signin() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleSignin = async () => {
        const res = await axios.post(`${SERVER_URL}signin/`, {
            email,
            password
        });
        if(res.status!==200){
            return
        }
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("user_id", res.data.userId);
        AuthStore.setState(prev => ({
            ...prev,
            token: res.data.token,
            user: res.data.userId
        }))
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center" >
            <div className="p-6 m-2 bg-white rounded text-black flex flex-col" >
                <div className="pt-2">
                    <input type="text" placeholder="Email" value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }} />
                </div>
                <div className="pt-2">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }} />
                </div>
                <div className="pt-2">
                    <Link href={"/dashboard"} >
                        <button className="bg-red-200 p-2 rounded-xl" onClick={handleSignin}>Sign in</button>
                    </Link>
                </div>
            </div>
        </div >
    )
}