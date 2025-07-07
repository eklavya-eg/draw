"use client"

import { SERVER_URL } from "@/config";
import { AuthStore } from "@/stores/auth";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

export default function Signin() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleSignin = async () => {
        const res = await axios.post(`${SERVER_URL}signin/`, {
            email,
            password
        });
        if (res.status !== 200) {
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <Palette className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                            Draw
                        </span>
                    </div>

                    <Card className="border-0 shadow-xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Welcome back</CardTitle>
                            <CardDescription>
                                Sign in to your account to continue drawing
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                />
                            </div>
                            <Button className="w-full" size="lg" onClick={handleSignin}>
                                Sign In
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Don{"'"}t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="text-red-600 hover:underline font-medium"
                                >
                                    Sign up
                                </Link>
                            </div>
                            <div className="text-center">
                                <Link href="/" className="text-sm text-gray-600 hover:underline">
                                    ← Back to home
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
    )
}