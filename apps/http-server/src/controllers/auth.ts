import { JWT_SECRET } from "@repo/common/config";
import { SigninSchema, SignupSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signup = async (req:Request, res:Response) => {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" })
    }
    const email = parsedData.data?.email || "";
    const password = parsedData.data?.password || "";
    const name = parsedData.data?.name || "";
    try {
        const user = await prismaClient.user.create({
            data: {
                email: email,
                password: password,
                name: name
            }
        });
        const token = jwt.sign({
            id: user.id
        }, JWT_SECRET);
        res.send({
            userId: user.id,
            token: token
        });
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this Email"
        });
    }
}

export const signin = async (req:Request, res:Response) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" })
    }
    const email = parsedData.data?.email;
    const password = parsedData.data?.password;
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: email,
                password: password
            }
        });
        if (user) {
            const token = jwt.sign({
                id: user.id
            }, JWT_SECRET);
            res.json({
                userId: user.id,
                token: token
            });
        } else {
            res.json({
                message: "User not found"
            })
        }
    } catch (e) {
        res.status(403).json({
            message: "Error"
        });
    }
}