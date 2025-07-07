import { Router } from "express";
import { authorization } from "../middlewares/auth";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const router : Router = Router();


router.post("/room", authorization, cre)

router.get("/rooms", authorization, async (req, res) => {
    try {
        const rooms = await prismaClient.room.findMany({
            where: {
                // @ts-ignore
                adminId: req.userId
            }
        })
        res.json({
            rooms: rooms.map((room)=>{
                return {
                    slug: room.slug,
                    roomId: room.id
                };
            })
        })
    } catch (e) {
        res.status(411).json({ message: "Slug not available" })
    }
})

router.get("/rooms", authorization, async (req, res) => {
    try {
        const rooms = await prismaClient.room.findMany({
            where: {
                // @ts-ignore
                adminId: req.userId
            }
        })
        res.json({
            rooms: rooms.map((room)=>{
                return {
                    slug: room.slug,
                    roomId: room.id
                };
            })
        })
    } catch (e) {
        res.status(411).json({ message: "Slug not available" })
    }
})

router.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    try {
        const chats = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            select: {
                message:true
            },
            orderBy: {
                id: 'desc'
            },
        });
        res.json({
            messages: chats.map(chat=>chat.message)
        })
    } catch {
        res.status(404).json({
            message: "Error"
        })
    }
})

router.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
        const room = await prismaClient.room.findFirst({
            where: {
                slug: slug
            }
        });
        res.json({
            roomId: room?.id
        })
    } catch {
        res.status(404).json({
            message: "Error"
        })
    }
})

export default router